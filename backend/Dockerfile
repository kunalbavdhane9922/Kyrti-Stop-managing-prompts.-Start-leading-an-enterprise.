# Multi-Stage Dockerfile for Kyrti AI Enterprise Protocol Microservices
# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy root pom and parent build configurations
COPY pom.xml .
COPY shared/ shared/
COPY services/ services/

# Compile all shared libraries and microservices
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install lightweight redis for local cache and session fallback when running in containers
RUN apk add --no-cache redis

# Target service to execute (e.g. saep-gateway, saep-identity, saep-company)
ARG SERVICE_NAME=saep-gateway
ENV SERVICE_NAME=${SERVICE_NAME}

# Copy all JAR files from the target directory
COPY --from=builder /build/services/${SERVICE_NAME}/target/*.jar /app/jars/

EXPOSE 8080 3000 3001 3002 3003 3004 3005

ENTRYPOINT ["sh", "-c", "if [ \"$REDIS_HOST\" = \"127.0.0.1\" ] || [ \"$REDIS_HOST\" = \"localhost\" ] || [ -z \"$REDIS_HOST\" ]; then redis-server --requirepass \"${REDIS_PASSWORD:-redispassword}\" --daemonize yes 2>/dev/null || redis-server --daemonize yes 2>/dev/null || true; fi; PORT_ARG=\"\"; if [ -n \"$PORT\" ]; then PORT_ARG=\"--server.port=$PORT\"; fi; java -jar $(ls /app/jars/*-exec.jar 2>/dev/null || ls /app/jars/*.jar | head -n 1) $PORT_ARG"]
