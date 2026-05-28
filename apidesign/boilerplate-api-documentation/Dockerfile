# Use the official Swagger UI Docker image as the base image
FROM swaggerapi/swagger-ui

# Set the environment variable for the Swagger JSON
ENV SWAGGER_JSON=/docs/openapi.yaml

# Copy the local directory to the Docker container
COPY ./docs /docs