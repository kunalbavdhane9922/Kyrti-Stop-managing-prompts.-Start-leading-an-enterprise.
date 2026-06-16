@REM Maven Wrapper script for Windows
@REM Auto-downloads Maven if not available
@echo off
setlocal

set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

set "MAVEN_VERSION=3.9.6"
set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%"
set "MAVEN_BIN=%MAVEN_HOME%\bin\mvn.cmd"

if exist "%MAVEN_BIN%" goto runMaven

echo Downloading Apache Maven %MAVEN_VERSION%...
mkdir "%MAVEN_HOME%" 2>nul
powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%TEMP%\maven.zip'"
powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force"
move "%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%" "%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%-tmp" 2>nul
move "%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%-tmp" "%MAVEN_HOME%" 2>nul
del "%TEMP%\maven.zip" 2>nul

:runMaven
"%MAVEN_BIN%" %*
