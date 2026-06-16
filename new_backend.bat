@echo off
title SAEP Backend Runner
echo =========================================
echo    Starting Complete SAEP Backend
echo =========================================

echo.
echo [1/3] Starting Docker Compose infrastructure...
docker-compose up -d

echo.
echo Waiting 15 seconds for databases to initialize...
timeout /t 15 /nobreak

echo.
echo [2/3] Loading environment variables...
if exist ".env" (
    FOR /F "usebackq tokens=1,* delims==" %%A IN (".env") DO (
        IF NOT "%%A"=="" IF NOT "%%A"==" " (
            set "%%A=%%B"
        )
    )
    echo .env file loaded.
) else (
    echo No .env file found, skipping.
)

echo.
echo [3/3] Starting Spring Boot Microservices...
echo The services will open in new command prompt windows.
echo Close those windows to stop the individual services.
echo.

start "SAEP Gateway" cmd /k "title SAEP Gateway && java -jar saep-gateway\target\saep-gateway-1.0.0-SNAPSHOT-exec.jar"
start "SAEP Identity" cmd /k "title SAEP Identity && java -jar saep-identity\target\saep-identity-1.0.0-SNAPSHOT-exec.jar"
start "SAEP Company" cmd /k "title SAEP Company && java -jar services\saep-parent\saep-company\target\saep-company-1.0.0-SNAPSHOT-exec.jar"
start "SAEP Organization" cmd /k "title SAEP Organization && java -jar services\saep-parent\saep-organization\target\saep-organization-1.0.0-SNAPSHOT-exec.jar"
start "SAEP Workforce" cmd /k "title SAEP Workforce && java -jar services\saep-parent\saep-workforce\target\saep-workforce-1.0.0-SNAPSHOT-exec.jar"

echo =========================================
echo All backend services launched successfully! 
echo =========================================
pause
