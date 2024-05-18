FROM python:3.10.12-alpine3.17

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./docker/matchmaking_system/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5433

COPY ./matches /app/
COPY ./docker/matchmaking_system/entrypoint.sh /app

#ENTRYPOINT [ "sh", "entrypoint.sh" ]
#CMD ["python", "manage.py", "runserver", "0.0.0.0:5433"]