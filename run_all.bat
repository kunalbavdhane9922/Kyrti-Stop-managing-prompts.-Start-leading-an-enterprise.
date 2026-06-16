@echo off
for /f "tokens=1,2 delims==" %%a in (.env) do (
    set "%%a=%%b"
)
start /b java -jar saep-gateway\target\saep-gateway-1.0.0-SNAPSHOT-exec.jar > gateway.log 2>&1
start /b java -jar saep-identity\target\saep-identity-1.0.0-SNAPSHOT-exec.jar > identity.log 2>&1
start /b java -jar services\saep-parent\saep-company\target\saep-company-1.0.0-SNAPSHOT-exec.jar > company.log 2>&1
start /b java -jar services\saep-parent\saep-organization\target\saep-organization-1.0.0-SNAPSHOT-exec.jar > organization.log 2>&1
start /b java -jar services\saep-parent\saep-workforce\target\saep-workforce-1.0.0-SNAPSHOT-exec.jar > workforce.log 2>&1
echo Background services launched successfully!
