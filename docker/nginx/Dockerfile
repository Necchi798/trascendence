FROM nginx:latest

# Copia il file di configurazione Nginx
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Copia i file del sito web
COPY front /usr/share/nginx/html

# Aggiorna il repository dei pacchetti e installa OpenSSL
RUN apt-get update && apt-get install -y openssl

#aggiorna il fusorario su roma
RUN ln -fs /usr/share/zoneinfo/Europe/Rome /etc/localtime

# Crea una cartella per i certificati
RUN mkdir -p /etc/nginx/certs

#aggiorna il fusorario su roma
RUN ln -fs /usr/share/zoneinfo/Europe/Rome /etc/localtime

# Genera la chiave privata e il certificato SSL nella cartella dei certificati
RUN openssl genpkey -algorithm RSA -out /etc/nginx/certs/private.key && \
    openssl req -new -key /etc/nginx/certs/private.key -out /etc/nginx/certs/certificate.csr -subj "/C=EU/ST=Italy/L=Molfetta/O=42/CN=www.transcendence.com" && \
    openssl x509 -req -days 365 -in /etc/nginx/certs/certificate.csr -signkey /etc/nginx/certs/private.key -out /etc/nginx/certs/certificate.crt

# Esponi la porta 80
EXPOSE 90
EXPOSE 4430
