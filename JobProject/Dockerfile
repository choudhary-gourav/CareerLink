# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────
# STAGE 1 — Build the JAR with Maven (no tests)
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /workspace/app

# Copy Maven wrapper and pom first — lets Docker cache the
# dependency layer so rebuilds skip the download step.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw && ./mvnw -B -DskipTests dependency:go-offline

# Now copy source and build
COPY src ./src

RUN ./mvnw -B -DskipTests clean package \
    && JAR_FILE="$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*.jar.original' | head -n 1)" \
    && cp "$JAR_FILE" app.jar

# ─────────────────────────────────────────────────────────────
# STAGE 2 — Lean runtime image (JRE only, no JDK)
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Install curl for healthcheck
RUN apk add --no-cache curl

# JVM tuning: respect container memory limits, fast startup seed
ENV JAVA_OPTS="-XX:+UseContainerSupport \
                -XX:MaxRAMPercentage=75 \
                -XX:+UseG1GC \
                -Djava.security.egd=file:/dev/./urandom"

# Render passes PORT at runtime; default to 8080
ENV PORT=8080

COPY --from=build --chown=spring:spring /workspace/app/app.jar /app/app.jar

USER spring:spring

# Document the port (Render reads this for routing)
EXPOSE 8080

# Runtime metadata (helps with image introspection & logging)
LABEL maintainer="Gourav Choudhary <gourav@example.com>"
LABEL version="1.0.0"
LABEL description="Docker image for JobProject – Spring Boot microservice"

# Health‑check – ensures the container reports healthy status
# The endpoint checks if the Spring Boot actuator health endpoint is up.
# Adjust the path/port if your app uses a different health URL.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/actuator/health || exit 1

# Run the application, respecting the PORT env var
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
