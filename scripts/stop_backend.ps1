$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
}
if ((Split-Path -Leaf $ScriptDir) -eq "scripts" -and (Test-Path (Join-Path $ScriptDir "..\backend"))) {
    $ScriptDir = (Resolve-Path (Join-Path $ScriptDir "..")).Path
}
Set-Location $ScriptDir

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "     ENTERPRISE PLATFORM - SHUTDOWN SCRIPT             " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

Write-Host "`nTerminating all SAEP Java and Node processes..." -ForegroundColor Yellow

$killed = 0

# Kill Java processes
$javaProcs = Get-Process -Name java -ErrorAction SilentlyContinue
if ($javaProcs) {
    foreach ($proc in $javaProcs) {
        Write-Host "Killing Java process (PID: $($proc.Id))" -ForegroundColor Gray
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        $killed++
    }
}

# Kill Node processes
$nodeProcs = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcs) {
    foreach ($proc in $nodeProcs) {
        Write-Host "Killing Node process (PID: $($proc.Id))" -ForegroundColor Gray
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        $killed++
    }
}

Write-Host "`nStopping Docker infrastructure..." -ForegroundColor Yellow
docker compose -f infrastructure\docker\docker-compose.yml down

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host " Shutdown Complete. $killed background processes killed. " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
