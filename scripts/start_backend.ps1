param([switch]$KeepAlive)

$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
}
if ((Split-Path -Leaf $ScriptDir) -eq "scripts" -and (Test-Path (Join-Path $ScriptDir "..\backend"))) {
    $ScriptDir = (Resolve-Path (Join-Path $ScriptDir "..")).Path
}
Set-Location $ScriptDir

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "     ENTERPRISE PLATFORM - DYNAMIC LAUNCH SCRIPT       " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# 1. Prerequisite Checks
Write-Host "`n[1/4] Checking System Prerequisites..." -ForegroundColor Yellow

$JavaCmd = Get-Command java -ErrorAction SilentlyContinue
if (-not $JavaCmd) {
    Write-Host "ERROR: Java is not installed or not in your system PATH. The backend cannot start." -ForegroundColor Red
    exit 1
}
$JavaExe = $JavaCmd.Source
$env:JAVA_HOME = Split-Path -Parent (Split-Path -Parent $JavaExe)

$NpmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $NpmCmd) {
    Write-Host "ERROR: npm is not installed or not in your system PATH. The frontend cannot start." -ForegroundColor Red
    exit 1
}

# 2. Docker Detection & Startup
Write-Host "`n[2/4] Initializing Docker Infrastructure..." -ForegroundColor Yellow
$dockerReady = $false
$result = docker info 2>&1
if ($LASTEXITCODE -eq 0) {
    $dockerReady = $true
    Write-Host "Docker daemon is already running." -ForegroundColor Green
} else {
    Write-Host "Docker daemon is not running. Attempting to start Docker Desktop..."
    
    $dockerPaths = @(
        "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe",
        "${env:ProgramFiles(x86)}\Docker\Docker\Docker Desktop.exe",
        "$env:LOCALAPPDATA\Docker\Docker\Docker Desktop.exe"
    )
    
    $dockerExe = $null
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            $dockerExe = $path
            break
        }
    }
    
    if ($dockerExe) {
        Start-Process $dockerExe
        Write-Host "Waiting for Docker daemon to start (this may take up to 60 seconds)..."
        for ($i = 0; $i -lt 30; $i++) {
            $result = docker info 2>&1
            if ($LASTEXITCODE -eq 0) {
                $dockerReady = $true
                break
            }
            Start-Sleep -Seconds 2
        }
    } else {
        Write-Host "Could not automatically locate Docker Desktop.exe. Please start Docker manually!" -ForegroundColor Red
    }
}

if (-not $dockerReady) {
    Write-Host "Proceeding without Docker. Note: Services may crash if they cannot connect to databases or Kafka." -ForegroundColor Yellow
} else {
    Write-Host "Starting infrastructure with infrastructure\docker\docker-compose.yml..."
    docker compose -f infrastructure\docker\docker-compose.yml up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker compose failed." -ForegroundColor Red
        exit 1
    }
    Write-Host "Waiting for infrastructure to initialize..."
    Start-Sleep -Seconds 15
    Write-Host "Waiting for PostgreSQL container to become ready..."
    for ($i = 0; $i -lt 15; $i++) {
        docker exec saep-postgres pg_isready -U postgres 2>$null
        if ($LASTEXITCODE -eq 0) { break }
        Start-Sleep -Seconds 2
    }
    Write-Host "Verifying required PostgreSQL databases exist..."
    $dbs = @("saep_identity", "saep_company", "saep_organization", "saep_workforce", "saep_marketplace", "saep_governance", "saep_workflow", "saep_communication", "saep_memory")
    foreach ($db in $dbs) {
        $exists = docker exec saep-postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$db'" 2>$null
        if ($exists -ne "1") {
            Write-Host "Creating missing database: $db..." -ForegroundColor Yellow
            docker exec saep-postgres psql -U postgres -c "CREATE DATABASE $db;" 2>$null
        }
    }
}

# 3. Environment Variables
Write-Host "`n[3/4] Loading Environment Configuration..." -ForegroundColor Yellow
$envFile = Join-Path $ScriptDir ".env"
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*(#|$)') { continue }
        if ($line -match '^\s*([^=]+?)\s*=\s*(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") {
                $value = $matches[1]
            }
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host ".env loaded successfully." -ForegroundColor Green
} else {
    Write-Host "No .env file found in project root. Proceeding with system defaults." -ForegroundColor Yellow
}

# Stop any existing processes on our specific ports to avoid conflicts
Write-Host "Terminating processes holding our specific backend and frontend ports..." -ForegroundColor Yellow
$PortsToKill = @(3000, 3002, 8081, 8082, 8084, 8085, 5173)

foreach ($port in $PortsToKill) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $pidToKill = $conn.OwningProcess
            if ($pidToKill -and $pidToKill -ne 0) {
                $proc = Get-Process -Id $pidToKill -ErrorAction SilentlyContinue
                if ($proc -and ($proc.Name -match "java" -or $proc.Name -match "node")) {
                    $procCim = Get-CimInstance Win32_Process -Filter "ProcessId = $pidToKill" -ErrorAction SilentlyContinue
                    if (-not $procCim -or $procCim.CommandLine -match "saep" -or $procCim.CommandLine -match "\.jar" -or $procCim.CommandLine -match "vite" -or $procCim.CommandLine -match "frontend") {
                        Write-Host "Killing process ID $pidToKill ($($proc.Name)) on port $port..." -ForegroundColor Yellow
                        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                    } else {
                        Write-Host "WARNING: Process ID $pidToKill on port $port is NOT a SAEP/Vite process. Skipping kill." -ForegroundColor Red
                    }
                }
            }
        }
    }
}
Start-Sleep -Seconds 3

# Function to tail logs until Spring Boot finishes starting
function Wait-For-SpringBootLog {
    param([string]$LogFile, [string]$ServiceName)
    Write-Host "`n>>> Tailing logs for $ServiceName... <<<" -ForegroundColor Cyan
    
    $timeout = [DateTime]::Now.AddSeconds(30)
    while (-not (Test-Path $LogFile)) {
        if ([DateTime]::Now -gt $timeout) {
            Write-Host ">>> $ServiceName FAILED: Log file was never created! <<<`n" -ForegroundColor Red
            return $false
        }
        Start-Sleep -Milliseconds 500
    }

    $stream = $null
    $fs = $null
    $retries = 10
    while ($null -eq $stream -and $retries -gt 0) {
        try {
            $fs = [System.IO.FileStream]::new($LogFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
            $stream = [System.IO.StreamReader]::new($fs)
        } catch {
            $retries--
            Start-Sleep -Milliseconds 500
        }
    }

    if ($null -eq $stream) {
        Write-Host ">>> $ServiceName FAILED: Could not open log file (File locked). <<<`n" -ForegroundColor Red
        return $false
    }

    try {
        $started = $false
        $timeout = [DateTime]::Now.AddMinutes(2)
        while (-not $started) {
            if ([DateTime]::Now -gt $timeout) {
                Write-Host ">>> $ServiceName TIMED OUT waiting for startup! Check $LogFile <<<`n" -ForegroundColor Red
                return $false
            }
            $line = $stream.ReadLine()
            if ($line -ne $null) {
                Write-Host "[$ServiceName] $line"
                if ($line -match "Started .* in .* seconds") {
                    $started = $true
                    Write-Host ">>> $ServiceName is READY! <<<`n" -ForegroundColor Green
                    return $true
                }
                if ($line -match "APPLICATION FAILED TO START" -or $line -match "Port .* is already in use") {
                    Write-Host ">>> $ServiceName FAILED TO START! Check $LogFile <<<`n" -ForegroundColor Red
                    return $false
                }
            } else {
                Start-Sleep -Milliseconds 200
            }
        }
    } finally {
        if ($null -ne $stream) { $stream.Close() }
        if ($null -ne $fs) { $fs.Close() }
    }
}

# 4. Launch Services
Write-Host "`n[4/4] Starting Microservices Sequence..." -ForegroundColor Yellow

function Start-Microservice {
    param([string]$Name, [string]$JarPath, [string]$LogName)
    Write-Host "Starting $Name..."
    $LogFile = Join-Path $ScriptDir $LogName
    
    if (Test-Path $LogFile) { Remove-Item $LogFile -Force -ErrorAction SilentlyContinue }
    
    $FullJarPath = Join-Path $ScriptDir $JarPath
    if (-not (Test-Path $FullJarPath)) {
        Write-Host ">>> $Name FAILED: JAR file not found at $FullJarPath! Did you run 'mvn clean package'? <<<" -ForegroundColor Red
        return $false
    }

    # Use cmd.exe redirection to ensure shared ReadWrite file access (bypasses PowerShell's exclusive lock)
    $cmdArgs = "/c `" `"$JavaExe`" -jar `"$FullJarPath`" > `"$LogName`" 2>&1 `""
    Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WorkingDirectory $ScriptDir -WindowStyle Hidden
    
    return (Wait-For-SpringBootLog -LogFile $LogFile -ServiceName $Name)
}

$svcs = @()
$svcs += Start-Microservice -Name "Gateway" -JarPath "backend\services\saep-gateway\target\saep-gateway-1.0.0-SNAPSHOT-exec.jar" -LogName "gateway.log"
$svcs += Start-Microservice -Name "Identity" -JarPath "backend\services\saep-identity\target\saep-identity-1.0.0-SNAPSHOT-exec.jar" -LogName "identity.log"
$svcs += Start-Microservice -Name "Company" -JarPath "backend\services\saep-company\target\saep-company-1.0.0-SNAPSHOT-exec.jar" -LogName "company.log"
$svcs += Start-Microservice -Name "Organization" -JarPath "backend\services\saep-organization\target\saep-organization-1.0.0-SNAPSHOT-exec.jar" -LogName "organization.log"
$svcs += Start-Microservice -Name "Workforce" -JarPath "backend\services\saep-workforce\target\saep-workforce-1.0.0-SNAPSHOT-exec.jar" -LogName "workforce.log"
# $svcs += Start-Microservice -Name "Marketplace" -JarPath "backend\services\saep-marketplace\target\saep-marketplace-1.0.0-SNAPSHOT-exec.jar" -LogName "marketplace.log"
$backendSuccess = ($svcs -notcontains $false) -and ($svcs -notcontains $null)

# Launch Virtual Office Server (FastAPI on Port 8000)
Write-Host "Starting Virtual Office Server (FastAPI on Port 8000)..."
$voServerDir = Join-Path $ScriptDir "virtual office\virtual-office-server"
if (Test-Path $voServerDir) {
    $voServerLog = Join-Path $ScriptDir "virtual_office_server.log"
    if (Test-Path $voServerLog) { Remove-Item $voServerLog -Force -ErrorAction SilentlyContinue }
    $cmdArgs = "/c `" py -m uvicorn main:app --host 0.0.0.0 --port 8000 > `"..\..\virtual_office_server.log`" 2>&1 `""
    Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WorkingDirectory $voServerDir -WindowStyle Hidden
}

# Launch Frontend
Write-Host "Starting Frontend (React)..."
$feLog = Join-Path $ScriptDir "frontend.log"
if (Test-Path $feLog) { Remove-Item $feLog -Force -ErrorAction SilentlyContinue }

$feDir = Join-Path $ScriptDir "frontend"
$cmdArgs = "/c `" npm run dev > `"..\frontend.log`" 2>&1 `""
Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WorkingDirectory $feDir -WindowStyle Hidden

Write-Host "`n>>> Tailing logs for Frontend... <<<" -ForegroundColor Cyan
$timeout = [DateTime]::Now.AddSeconds(30)
while (-not (Test-Path $feLog)) {
    if ([DateTime]::Now -gt $timeout) {
        Write-Host ">>> Frontend FAILED: Log file was never created! <<<`n" -ForegroundColor Red
        break
    }
    Start-Sleep -Milliseconds 500
}

$feStarted = $false
if (Test-Path $feLog) {
    # Robust StreamReader attachment
    $feStream = $null
    $fs = $null
    $retries = 10
    while ($null -eq $feStream -and $retries -gt 0) {
        try {
            $fs = [System.IO.FileStream]::new(
                (Convert-Path $feLog),
                [System.IO.FileMode]::Open,
                [System.IO.FileAccess]::Read,
                [System.IO.FileShare]::ReadWrite
            )
            $feStream = [System.IO.StreamReader]::new($fs)
        } catch {
            $retries--
            Start-Sleep -Milliseconds 200
        }
    }

    if ($null -ne $feStream) {
        try {
            $timeout = [DateTime]::Now.AddMinutes(2)
            while (-not $feStarted) {
                if ([DateTime]::Now -gt $timeout) {
                    Write-Host ">>> Frontend TIMED OUT waiting for startup! <<<`n" -ForegroundColor Red
                    break
                }
                $line = $feStream.ReadLine()
                if ($line -ne $null) {
                    Write-Host "[Frontend] $line"
                    if ($line -match "http://localhost") {
                        $feStarted = $true
                        Write-Host ">>> Frontend is READY! <<<`n" -ForegroundColor Green
                    }
                    if ($line -match "already in use") {
                        $feStarted = $true
                        Write-Host ">>> Frontend port is already in use. Assuming it's already running. <<<`n" -ForegroundColor Yellow
                        break
                    }
                } else {
                    Start-Sleep -Milliseconds 200
                }
            }
        } finally {
            if ($null -ne $feStream) { $feStream.Close() }
            if ($null -ne $fs) { $fs.Close() }
        }
    }
}

Write-Host "=======================================================" -ForegroundColor Cyan
if ($backendSuccess -and $feStarted) {
    Write-Host " ALL ENTERPRISE SERVICES SUCCESSFULLY STARTED! " -ForegroundColor Green
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host "Backend Services: Gateway, Identity, Company, Organization, Workforce"
    Write-Host "Frontend App: Running on http://localhost:5173"

    Write-Host "Launching Enterprise Platform in your default browser..." -ForegroundColor Yellow
    Start-Process "http://localhost:5173"

    Write-Host "NOTE: The backend microservices are now running safely as independent background processes!"
} else {
    Write-Host " STARTUP COMPLETED WITH ERRORS! " -ForegroundColor Red
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host "Not all services started successfully. Check the console and logs for details." -ForegroundColor Yellow
}

if ($KeepAlive) {
    Write-Host "KeepAlive flag detected. Holding process open to keep background jobs alive..." -ForegroundColor Cyan
    while ($true) {
        Start-Sleep -Seconds 60
    }
}
