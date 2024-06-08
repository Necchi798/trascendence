FROM python:3.10.12-alpine3.17

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./docker/matchmaking_system/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

#test inizio
RUN apk update && apk add --no-cache openssl
RUN openssl genpkey -algorithm RSA -out /app/private.key
RUN openssl req -new -key /app/private.key -out /app/certificate.csr -subj "/C=EU/ST=Italy/L=Molfetta/O=42/CN=www.transcendence.com"
RUN openssl x509 -req -days 365 -in /app/certificate.csr -signkey /app/private.key -out /app/certificate.crt
#test fine

#EXPOSE 9001

COPY ./matches /app/
#COPY ./docker/matchmaking_system/entrypoint.sh /app

#CMD ["python", "manage.py", "runserver", "0.0.0.0:5433"]
#ENTRYPOINT [ "sh", "entrypoint.sh" ]