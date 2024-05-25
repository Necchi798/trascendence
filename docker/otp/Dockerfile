# Use an official Python runtime as a parent image
FROM python:3.10.12-alpine3.17

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install dependencies
COPY ./docker/otp/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install OpenSSL
RUN apk add --no-cache openssl

# Generate SSL key and certificate
RUN openssl genpkey -algorithm RSA -out /app/private.key
RUN openssl req -new -key /app/private.key -out /app/certificate.csr -subj "/C=EU/ST=Italy/L=Molfetta/O=42/CN=www.transcendence.com"
RUN openssl x509 -req -days 365 -in /app/certificate.csr -signkey /app/private.key -out /app/certificate.crt

# Copy the project code into the container
COPY ./twofa /app/

