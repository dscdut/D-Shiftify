# Boilerplate API Documentation

API documentation for the boilerplate projects, created by GDSC-DUT. This documentation offers detailed insights into the common API endpoints used across all templates.

## How to run locally
### 1. Using Docker
First, you need to determine the current location of your project. You can do this by running the following command in your terminal:
```
pwd
```
Next, run the following Docker command to start the Swagger UI:
```
docker run -p <custom-port>:8080 -e SWAGGER_JSON=<filepath> -v <path1>:<path2> swaggerapi/swagger-ui
```
Explanation of the Docker Command
```
-p <custom-port>:8080:
```
This option maps the port `8080` inside the Docker container to a custom port on your local machine. Replace `<custom-port>` with any port number you prefer to access the Swagger UI in your browser (e.g., 3000, 4000).
```
-v <path1>:<path2>
```
This option mounts a directory from your local file system into the Docker container. Here's what each part means:

`path1`: This is the path on your local machine that you want to mount.

`path2`: This is the path inside the Docker container where `path1` will be mounted.
```
-e SWAGGER_JSON=<filepath>
```
This environment variable tells the Docker container where to find your Swagger JSON file. Replace `filepath` with the path to your Swagger JSON file inside the Docker container. This `filepath` is related to `path2`

For example, if this project is located at `/Users/username/projects/swagger-docs-api-boilerplate`, and you want to mount it to `/foo` in the Swagger docker container and then run with port `8085`, you would use:
```
docker run -p 8085:8080 -e SWAGGER_JSON=/foo/openapi.yaml -v /Users/username/projects/swagger-docs-api-boilerplate:/foo swaggerapi/swagger-ui
```

### 2. Using Jetbrains IDEs
Just open this project in any Jetbrains IDEs, and they will handle the rest.

### 3. Using Python
#### Prerequisites
- [Python](https://www.python.org/) v3.10+

#### Setup virtual environment
```bash
# Create virtual env
python -m venv venv

# Activate the venv
# On window
.\venv\Scripts\activate

# On MacOs
source ./venv/bin/activatee

# Deactivate the venv
deactivate
```
#### Setup dependencies & environment

1. Change directory to `python` folder
```bash
cd python
```

2. Inside the `python` folder apply these following command to install dependencies
```bash
pip install -r requirements.txt
```

#### Run up the documentation
```bash
python swagger-ui.py
```

Open browser and access `localhost:8989/api/doc` to view swagger documentation

## How to update swagger documentation
Modify the `docs/openapi.yaml` file to update your api documentation
