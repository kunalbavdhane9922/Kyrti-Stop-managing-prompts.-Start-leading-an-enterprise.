<#
.SYNOPSIS
Enterprise Environment Setup Script

.DESCRIPTION
This script sets up the full enterprise environment, including:
1. Pre-flight dependency checks (Java 17+, Node.js, Docker)
2. Environment configuration validation
3. Infrastructure startup and health verification (Docker Compose)
4. Backend Compilation via Maven Wrapper
5. Frontend Setup via NPM
6. Diagnostics Report Generation
#>

$ErrorActionPreference = "Stop"
$ReportPath = ".\setup_report.log"

function Write-Log {
    param([string]$Message, [string]$Type="INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] [$Type] $Message"
    Write-Host $LogMessage
    Add-Content -Path $ReportPath -Value $LogMessage
}

function Check-Command {
    param([string]$Cmd)
    try {
        $null = Get-Command $Cmd -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Initialize Report
"=== Enterprise Environment Setup Report ===" | Out-File -FilePath $ReportPath -Encoding utf8
Write-Log "Starting environment setup..."

# 1. Pre-flight Checks
Write-Log "Running pre-flight checks..."

# Check Java
if (-not (Check-Command "java")) {
    Write-Log "Java is not installed or not in PATH." "ERROR"
    Write-Log "Please install Java 17+ from https://adoptium.net/ and ensure it is in your system PATH." "ERROR"
    exit 1
}

$JavaVer = java -version 2>&1 | Select-String -Pattern '"(\d+)' | % { $_.Matches.Groups[1].Value }
if ([int]$JavaVer -lt 17) {
    Write-Log "Java version must be 17 or higher. Found: $JavaVer" "ERROR"
    exit 1
}
Write-Log "Java check passed (Version $JavaVer)."

# Check Node
if (-not (Check-Command "node")) {
    Write-Log "Node.js is not installed or not in PATH." "ERROR"
    Write-Log "Please install Node.js 18+ from https://nodejs.org/." "ERROR"
    exit 1
}
$NodeVer = (node -v) -replace 'v', ''
$NodeMajor = [int]($NodeVer -split '\.')[0]
if ($NodeMajor -lt 18) {
    Write-Log "Node.js version must be 18 or higher. Found: $NodeMajor" "ERROR"
    exit 1
}
Write-Log "Node.js check passed (Version $NodeVer)."

# Check Docker
if (-not (Check-Command "docker")) {
    Write-Log "Docker is not installed or not in PATH." "ERROR"
    Write-Log "Please install Docker Desktop from https://www.docker.com/products/docker-desktop/." "ERROR"
    exit 1
}
$DockerRunning = docker info 2>&1
if ($DockerRunning -match "error during connect") {
    Write-Log "Docker daemon is not running. Please start Docker Desktop and try again." "ERROR"
    exit 1
}
Write-Log "Docker check passed."

# 2. Environment Configuration
Write-Log "Configuring environment..."
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Log "Copying .env.example to .env..."
        Copy-Item ".env.example" ".env"
    } else {
        Write-Log "Neither .env nor .env.example was found!" "ERROR"
        exit 1
    }
}

# Validate Environment Variables
Write-Log "Validating .env configuration..."
$EnvContent = Get-Content ".env"
$RequiredKeys = @("POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB")
foreach ($Key in $RequiredKeys) {
    $Match = $EnvContent | Select-String -Pattern "^${Key}=(.*)$"
    if (-not $Match) {
        Write-Log "Missing required key in .env: $Key" "ERROR"
        exit 1
    }
    $Value = $Match.Matches.Groups[1].Value.Trim()
    if ([string]::IsNullOrWhiteSpace($Value)) {
        Write-Log "Empty value for key in .env: $Key" "ERROR"
        exit 1
    }
}
Write-Log "Environment configuration validated."

# 3. Infrastructure Startup
Write-Log "Starting infrastructure via Docker Compose..."
try {
    docker-compose up -d
} catch {
    Write-Log "Failed to start Docker Compose infrastructure." "ERROR"
    exit 1
}

# 4. Infrastructure Health Checks
Write-Log "Waiting for infrastructure to become healthy..."
$MaxRetries = 30
$WaitSeconds = 5

function Check-Port {
    param([string]$Host, [int]$Port)
    try {
        $TcpClient = New-Object System.Net.Sockets.TcpClient
        $ConnectTask = $TcpClient.ConnectAsync($Host, $Port)
        $ConnectTask.Wait(2000) | Out-Null
        $IsConnected = $TcpClient.Connected
        $TcpClient.Close()
        return $IsConnected
    } catch {
        return $false
    }
}

$RequiredPorts = @{
    "PostgreSQL" = 5432
    "Kafka" = 9092
    "Redis" = 6379
    "Neo4j" = 7474
}

foreach ($Service in $RequiredPorts.GetEnumerator()) {
    $Port = $Service.Value
    $Name = $Service.Name
    $Attempt = 0
    $IsHealthy = $false

    Write-Log "Checking health for $Name (Port $Port)..."
    
    while ($Attempt -lt $MaxRetries) {
        if (Check-Port "127.0.0.1" $Port) {
            $IsHealthy = $true
            Write-Log "$Name is healthy and reachable."
            break
        }
        $Attempt++
        Start-Sleep -Seconds $WaitSeconds
    }

    if (-not $IsHealthy) {
        Write-Log "Health check failed for $Name after $($MaxRetries * $WaitSeconds) seconds." "ERROR"
        exit 1
    }
}

# 5. Backend Build
Write-Log "Building Backend Microservices..."
try {
    # Ensure wrapper is executable if needed, but on Windows .cmd is used
    if (Test-Path ".\mvnw.cmd") {
        Write-Log "Running Maven Wrapper build..."
        $process = Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "clean","install","-DskipTests" -NoNewWindow -Wait -PassThru
        if ($process.ExitCode -ne 0) {
            Write-Log "Backend build failed with exit code $($process.ExitCode)" "ERROR"
            exit 1
        }
    } else {
        Write-Log "Maven wrapper (mvnw.cmd) not found in root directory!" "ERROR"
        exit 1
    }
    Write-Log "Backend build completed successfully."
} catch {
    Write-Log "Exception occurred during backend build." "ERROR"
    Write-Log $_.Exception.Message "ERROR"
    exit 1
}

# 6. Frontend Setup
Write-Log "Setting up Frontend..."
if (Test-Path ".\frontend") {
    Push-Location ".\frontend"
    try {
        $process = Start-Process -FilePath "npm.cmd" -ArgumentList "install" -NoNewWindow -Wait -PassThru
        if ($process.ExitCode -ne 0) {
            Write-Log "Frontend setup failed with exit code $($process.ExitCode)" "ERROR"
            Pop-Location
            exit 1
        }
        Write-Log "Frontend dependencies installed successfully."
    } catch {
        Write-Log "Exception occurred during frontend setup." "ERROR"
        Pop-Location
        exit 1
    }
    Pop-Location
} else {
    Write-Log "Frontend directory not found!" "ERROR"
    exit 1
}

# 7. Validation and Summary
Write-Log "========================================"
Write-Log "ENVIRONMENT SETUP COMPLETE"
Write-Log "========================================"
Write-Log "All infrastructure is running and healthy."
Write-Log "Backend compiled successfully."
Write-Log "Frontend dependencies installed."
Write-Log "Diagnostics report saved to $ReportPath"
Write-Log ""
Write-Log "Next steps:"
Write-Log "1. To start the backend services, you can run the individual Spring Boot applications or your backend start script."
Write-Log "2. To start the frontend, navigate to 'frontend' and run 'npm run dev'."
