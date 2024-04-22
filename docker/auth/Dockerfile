# Use an official Python runtime as a parent image
FROM python:3.10.12-alpine3.17

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install dependencies
COPY ./docker/auth/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

#copy ssl certificates
COPY ./docker/auth/private.key /app/
COPY ./docker/auth/certificate.crt /app/

# Copy the project code into the container
COPY ./auth_service /app/

