FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven Wrapper and pom.xml
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Make mvnw executable
RUN chmod +x mvnw

# Copy source code first (så vi bygger med senaste pom.xml)
COPY src src

# Build application with forced update
RUN ./mvnw clean package -DskipTests -U

# Expose port
EXPOSE 8081

# Run application with Docker profile
CMD ["java", "-jar", "-Dspring.profiles.active=docker", "-Dserver.port=8081", "target/Backend-0.0.1-SNAPSHOT.jar"]