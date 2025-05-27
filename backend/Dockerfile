FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy the Maven configuration files
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download all dependencies
RUN mvn dependency:go-offline -B

# Copy the project source
COPY src src

# Build the application
RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Install Git
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
