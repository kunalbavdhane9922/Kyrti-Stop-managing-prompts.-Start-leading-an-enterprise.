#!/usr/bin/env bash

# Enterprise Environment Setup Script for Linux
# Exit immediately if a command exits with a non-zero status
set -e

REPORT_PATH="./setup_report.log"
echo "=== Enterprise Environment Setup Report ===" > "$REPORT_PATH"

log() {
    local msg="$1"
    local level="${2:-INFO}"
    local timestamp
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[$timestamp] [$level] $msg" | tee -a "$REPORT_PATH"
}

# 1. Pre-flight Checks
log "Running pre-flight checks..."

# Check Java
if ! command -v java &> /dev/null; then
    log "Java is not installed or not in PATH." "ERROR"
    log "Please install Java 17+ (e.g., OpenJDK 17) and try again." "ERROR"
    exit 1
fi
JAVA_VER_STR=$(java -version 2>&1 | head -n 1)
if [[ "$JAVA_VER_STR" =~ version[[:space:]]\"([0-9]+) ]]; then
    JAVA_VER="${BASH_REMATCH[1]}"
elif [[ "$JAVA_VER_STR" =~ \"([0-9]+)\. ]]; then
    JAVA_VER="${BASH_REMATCH[1]}"
else
    JAVA_VER="unknown"
fi

if [ "$JAVA_VER" != "unknown" ] && [ "$JAVA_VER" -lt 17 ]; then
    log "Java version must be 17 or higher. Found version: $JAVA_VER" "ERROR"
    exit 1
fi
log "Java check passed (Version $JAVA_VER)."

# Check Node.js
if ! command -v node &> /dev/null; then
    log "Node.js is not installed or not in PATH." "ERROR"
    log "Please install Node.js 18+ and try again." "ERROR"
    exit 1
fi
NODE_VER=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
    log "Node.js version must be 18 or higher. Found version: $NODE_VER" "ERROR"
    exit 1
fi
log "Node.js check passed (Version $NODE_VER)."

# Check Docker
if ! command -v docker &> /dev/null; then
    log "Docker is not installed or not in PATH." "ERROR"
    log "Please install Docker and try again." "ERROR"
    exit 1
fi
if ! docker info &> /dev/null; then
    log "Docker daemon is not running. Please start Docker and try again." "ERROR"
    exit 1
fi
log "Docker check passed."

# 2. Environment Configuration
log "Configuring environment..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        log "Copying .env.example to .env..."
        cp .env.example .env
    else
        log "Neither .env nor .env.example was found!" "ERROR"
        exit 1
    fi
fi

# Validate Environment Variables
log "Validating .env configuration..."
REQUIRED_KEYS=("POSTGRES_USER" "POSTGRES_PASSWORD" "POSTGRES_DB")
for key in "${REQUIRED_KEYS[@]}"; do
    if ! grep -q "^${key}=" .env; then
        log "Missing required key in .env: $key" "ERROR"
        exit 1
    fi
    val=$(grep "^${key}=" .env | cut -d= -f2- | xargs)
    if [ -z "$val" ]; then
        log "Empty value for key in .env: $key" "ERROR"
        exit 1
    fi
done
log "Environment configuration validated."

# 3. Infrastructure Startup
log "Starting infrastructure via Docker Compose..."
cd infrastructure/docker
docker compose up -d
cd ../..

# 4. Infrastructure Health Checks
log "Waiting for infrastructure to become healthy..."
MAX_RETRIES=30
WAIT_SECONDS=5

check_port() {
    local host="$1"
    local port="$2"
    nc -z -w 1 "$host" "$port" &> /dev/null
}

# Check netcat availability
if ! command -v nc &> /dev/null; then
    log "netcat (nc) not found. Skipping port availability health checks (assuming services will launch)." "WARN"
else
    declare -A REQUIRED_PORTS=(
        ["PostgreSQL"]="5432"
        ["Kafka"]="9092"
        ["Redis"]="6379"
        ["Neo4j"]="7474"
    )

    for service in "${!REQUIRED_PORTS[@]}"; do
        port="${REQUIRED_PORTS[$service]}"
        attempt=0
        is_healthy=false

        log "Checking health for $service (Port $port)..."
        while [ $attempt -lt $MAX_RETRIES ]; do
            if check_port "127.0.0.1" "$port"; then
                is_healthy=true
                log "$service is healthy and reachable."
                break
            fi
            attempt=$((attempt + 1))
            sleep $WAIT_SECONDS
        done

        if [ "$is_healthy" = false ]; then
            log "Health check failed for $service after $((MAX_RETRIES * WAIT_SECONDS)) seconds." "ERROR"
            exit 1
        fi
    done
fi

# 5. Backend Build
log "Building Backend Microservices..."
if [ -f "backend/mvnw" ]; then
    log "Running Maven Wrapper build..."
    cd backend
    chmod +x mvnw
    ./mvnw clean install -N
    ./mvnw clean install -DskipTests
    cd ..
    log "Backend build completed successfully."
else
    log "Maven wrapper (mvnw) not found in backend directory!" "ERROR"
    exit 1
fi

# 6. Frontend Setup
log "Setting up Frontend..."
if [ -d "frontend" ]; then
    cd frontend
    npm install
    cd ..
    log "Frontend dependencies installed successfully."
else
    log "Frontend directory not found!" "ERROR"
    exit 1
fi

log "========================================"
log "ENVIRONMENT SETUP COMPLETE" "SUCCESS"
log "========================================"
log "All infrastructure is running and healthy."
log "Backend compiled successfully."
log "Frontend dependencies installed."
log "Diagnostics report saved to $REPORT_PATH"
echo ""
echo "Next steps:"
echo "1. To start the backend and frontend apps, run: ./scripts/start_backend.sh"
echo "2. To stop the application later, run: ./scripts/stop_backend.sh"
echo ""
