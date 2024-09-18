FROM openjdk:17-jdk-slim
COPY target/boleta-service-0.0.1-SNAPSHOT.jar bill-app.jar
ENTRYPOINT ["java","-jar", "bill-app.jar"]