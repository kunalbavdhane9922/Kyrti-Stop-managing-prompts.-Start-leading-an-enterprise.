#!/usr/bin/env bash

# Dynamic Launch Script for SAEP Backend and Frontend on Linux
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." &> /dev/null && pwd)"
cd "$ROOT_DIR"

echo -e "\033[0;36m=======================================================\033[0m"
echo -e "\033[0;36m     ENTERPRISE PLATFORM - DYNAMIC LAUNCH SCRIPT       \033[0m"
echo -e "\033[0;36m=======================================================\033[0m"

# 1. Prerequisite Checks
echo -e "\n\033[0;33m[1/4] Checking System Prerequisites...\033[0m"

if ! command -v java &> /dev/null; then
    echo -e "\033[0;31mERROR: Java is not installed or not in your system PATH. The backend cannot start.\033[0m"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "\033[0;31mERROR: npm is not installed or not in your system PATH. The frontend cannot start.\033[0m"
    exit 1
fi

# 2. Docker Detection & Startup
echo -e "\n\033[0;33m[2/4] Initializing Docker Infrastructure...\033[0m"
if docker info &> /dev/null; then
    echo -e "\033[0;32mDocker daemon is running.\033[0m"
    echo "Starting infrastructure with infrastructure/docker/docker-compose..."
    cd infrastructure/docker
    docker compose up -d
    cd ../..
    echo "Waiting 15 seconds for infrastructure to initialize..."
    sleep 15
else
    echo -e "\033[0;33mWARNING: Docker daemon is not running. Services may crash if they cannot connect to databases/Kafka.\033[0m"
fi

# 3. Environment Variables
echo -e "\n\033[0;33m[3/4] Loading Environment Configuration...\033[0m"
if [ -f ".env" ]; then
    # Load env variables, skipping comments and empty lines
    export $(grep -v '^#' .env | xargs)
    echo -e "\033[0;32m.env loaded successfully.\033[0m"
else
    echo -e "\033[0;33mNo .env file found in project root. Proceeding with system defaults.\033[0m"
fi

# Override hostnames for host execution (localhost connection to Docker mapped ports)
export POSTGRES_HOST=localhost
export REDIS_HOST=localhost
export KAFKA_BROKER=localhost:9094
export KAFKA_BOOTSTRAP_SERVERS=localhost:9094
export ZIPKIN_ENDPOINT=http://localhost:9411/api/v2/spans
export TEMPORAL_ADDRESS=localhost:7233

# Terminate existing processes on the specific ports to avoid conflicts
echo -e "Terminating processes holding our specific backend and frontend ports..."
PORTS_TO_KILL=(3000 3002 8081 8082 8084 8085 5173)
for port in "${PORTS_TO_KILL[@]}"; do
    if command -v fuser &> /dev/null; then
        fuser -k "${port}/tcp" &> /dev/null || true
    elif command -v lsof &> /dev/null; then
        PID=$(lsof -t -i:"$port" || true)
        if [ -n "$PID" ]; then
            echo "Killing process $PID on port $port..."
            kill -9 $PID || true
        fi
    fi
done
sleep 3

# Helper function to tail logs until Spring Boot finishes starting
wait_for_springboot_log() {
    local log_file="$1"
    local service_name="$2"
    echo -e "\n\033[0;36m>>> Tailing logs for $service_name... <<<\033[0m"
    
    # Wait for log file to be created
    local timeout=30
    local elapsed=0
    while [ ! -f "$log_file" ]; do
        if [ $elapsed -ge $timeout ]; then
            echo -e "\033[0;31m>>> $service_name FAILED: Log file was never created! <<<\033[0m\n"
            return 1
        fi
        sleep 0.5
        elapsed=$((elapsed + 1))
    done

    # Read the log file line by line
    local started=false
    local log_timeout=120 # 2 minutes
    local log_elapsed=0
    
    # Using tail to read lines as they are appended
    tail -f -n 0 "$log_file" | while read -r line; do
        echo "[$service_name] $line"
        if echo "$line" | grep -q "Started .* in .* seconds"; then
            echo -e "\033[0;32m>>> $service_name is READY! <<<\033[0m\n"
            # Kill tail process safely
            pkill -P $$ tail || true
            break
        elif echo "$line" | grep -q -E "APPLICATION FAILED TO START|Port .* already in use|Error starting ApplicationContext"; then
            echo -e "\033[0;31m>>> $service_name FAILED TO START! Check $log_file <<<\033[0m\n"
            pkill -P $$ tail || true
            return 1
        fi
    done
    return 0
}

# 4. Launch Services
echo -e "\n\033[0;33m[4/4] Starting Microservices Sequence...\033[0m"

start_microservice() {
    local name="$1"
    local search_dir="$2"
    local log_name="$3"
    
    echo "Starting $name..."
    local log_file="$ROOT_DIR/$log_name"
    if [ -f "$log_file" ]; then
        rm "$log_file"
    fi
    
    # Dynamically find the executables/jars in the target folder, preferring -exec.jar first
    local jar_file
    jar_file=$(find "$ROOT_DIR/$search_dir" -name "*-exec.jar" | head -n 1 || true)
    if [ -z "$jar_file" ] || [ ! -f "$jar_file" ]; then
        jar_file=$(find "$ROOT_DIR/$search_dir" -name "*.jar" | grep -E "(exec|SNAPSHOT)\.jar" | head -n 1 || true)
    fi
    
    if [ -z "$jar_file" ] || [ ! -f "$jar_file" ]; then
        echo -e "\033[0;31m>>> $name FAILED: JAR file not found in $search_dir! Did you run './setup.sh'? <<<\033[0m"
        return 1
    fi

    # Launch java process in background
    nohup java -jar "$jar_file" > "$log_file" 2>&1 &
    
    # Wait for completion
    wait_for_springboot_log "$log_file" "$name"
}

# Boot order
start_microservice "Gateway" "backend/services/saep-gateway/target" "gateway.log"
start_microservice "Identity" "backend/services/saep-identity/target" "identity.log"
start_microservice "Company" "backend/services/saep-company/target" "company.log"
start_microservice "Organization" "backend/services/saep-organization/target" "organization.log"
start_microservice "Workforce" "backend/services/saep-workforce/target" "workforce.log"

# Launch Frontend
echo "Starting Frontend (React)..."
FE_LOG="$ROOT_DIR/frontend.log"
if [ -f "$FE_LOG" ]; then
    rm "$FE_LOG"
fi

cd frontend
nohup npm run dev > "$FE_LOG" 2>&1 &
cd ..

echo -e "\n\033[0;36m>>> Tailing logs for Frontend... <<<\033[0m"
# Wait for log file to be created
elapsed=0
while [ ! -f "$FE_LOG" ]; do
    if [ $elapsed -ge 30 ]; then
        echo -e "\033[0;31m>>> Frontend FAILED: Log file was never created! <<<\033[0m\n"
        break
    fi
    sleep 0.5
    elapsed=$((elapsed + 1))
done

if [ -f "$FE_LOG" ]; then
    tail -f -n 0 "$FE_LOG" | while read -r line; do
        echo "[Frontend] $line"
        if echo "$line" | grep -q -E "http://localhost|Local:"; then
            echo -e "\033[0;32m>>> Frontend is READY! <<<\033[0m\n"
            pkill -P $$ tail || true
            break
        elif echo "$line" | grep -q "already in use"; then
            echo -e "\033[0;33m>>> Frontend port is already in use. Assuming it's already running. <<<\033[0m\n"
            pkill -P $$ tail || true
            break
        fi
    done
fi

echo -e "\033[0;36m=======================================================\033[0m"
echo -e "\033[0;32m ALL ENTERPRISE SERVICES SUCCESSFULLY STARTED! \033[0m"
echo -e "\033[0;36m=======================================================\033[0m"
echo "Backend Services: Gateway, Identity, Company, Organization, Workforce"
echo "Frontend App: Running on http://localhost:5173"
echo "Note: The services are running as background processes. Check logs (*.log) for details."
echo ""
