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

# Target service to execute (e.g. saep-gateway, saep-identity, saep-company)
ARG SERVICE_NAME=saep-gateway
ENV SERVICE_NAME=${SERVICE_NAME}

# Copy all JAR files from the target directory
COPY --from=builder /build/services/${SERVICE_NAME}/target/*.jar /app/jars/

EXPOSE 8080 3000 3001 3002 3003 3004 3005

ENTRYPOINT ["sh", "-c", "java -jar $(ls /app/jars/*-exec.jar 2>/dev/null || ls /app/jars/*.jar | head -n 1)"]
