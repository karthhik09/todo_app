# --------------------------------------------------------
# Stage 1: Build the Application
# We use the official OpenJDK 25 image (Eclipse Temurin)
# --------------------------------------------------------
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# Copy the project files
COPY . .

# Ensure the Maven Wrapper is executable
RUN chmod +x mvnw

# Build the JAR file using the wrapper (downloads Maven 4.x automatically if needed)
# skipping tests to speed up deployment
RUN ./mvnw clean package -DskipTests

# --------------------------------------------------------
# Stage 2: Run the Application
# We use a smaller JRE image for production to save space
# --------------------------------------------------------
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy the built JAR from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (Default Spring Boot port)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]