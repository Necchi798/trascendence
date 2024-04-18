# Use an official Python runtime as a parent image
FROM python:3.8-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install dependencies
#COPY ./docker/auth/requirements.txt /app/
#COPY ./docker/auth/script.sh /app/

# Copy the project code into the container
COPY ./auth_service /app/

CMD [ "script.sh" ]