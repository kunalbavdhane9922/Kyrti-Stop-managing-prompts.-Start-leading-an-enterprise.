@echo off
FOR /F "usebackq tokens=1,* delims==" %%A IN (".env") DO (
    IF NOT "%%A"=="" IF NOT "%%A"==" " (
        set "%%A=%%B"
    )
)
start /b java -jar saep-gateway\target\saep-gateway-1.0.0-SNAPSHOT-exec.jar > gateway.log 2> gateway.err
start /b java -jar saep-identity\target\saep-identity-1.0.0-SNAPSHOT-exec.jar > identity.log 2> identity.err
start /b java -jar services\saep-parent\saep-company\target\saep-company-1.0.0-SNAPSHOT-exec.jar > company.log 2> company.err
start /b java -jar services\saep-parent\saep-organization\target\saep-organization-1.0.0-SNAPSHOT-exec.jar > organization.log 2> organization.err
start /b java -jar services\saep-parent\saep-workforce\target\saep-workforce-1.0.0-SNAPSHOT-exec.jar > workforce.log 2> workforce.err
echo Backend services started.
