FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]

# Build stage med korrekt Maven + JDK 17
#FROM maven:3.8.7-openjdk-17 AS build
#WORKDIR /app
#COPY pom.xml .
#RUN mvn dependency:go-offline
#COPY src ./src
#RUN mvn clean package -DskipTests

# Runtime stage med korrekt JDK 17
#FROM eclipse-temurin:17-jre-alpine
#WORKDIR /app
#COPY --from=build /app/target/*.jar app.jar
#EXPOSE 8080
#CMD ["java", "-jar", "app.jar"]