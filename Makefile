.PHONY: all enviroment clean

all: enviroment up

up : 
	@docker-compose up --build

down : 
	@docker-compose down


enviroment:
	@echo "Generazione del file .env"
	@if [ -e .env ]; then \
		echo "Il file .env esiste già. Non è necessario ricrearlo."; \
	else \
		read -p "Inserisci il valore per SECRET_JWT: " SECRET_JWT; \
		read -p "Inserisci il valore per DB_PASSWORD: " DB_PASSWORD; \
		read -p "Inserisci il valore per CLIENT_ID: " CLIENT_ID; \
		read -p "Inserisci il valore per CLIENT_SECRET: " CLIENT_SECRET; \
		read -p "Inserisci il valore per REDIRECT_URI: " REDIRECT_URI; \
		echo "SECRET_JWT=$$SECRET_JWT" > .env; \
		echo "DB_PASSWORD=$$DB_PASSWORD" >> .env; \
		echo "CLIENT_ID=$$CLIENT_ID" >> .env; \
		echo "CLIENT_SECRET=$$CLIENT_SECRET" >> .env; \
		echo "REDIRECT_URI=$$REDIRECT_URI" >> .env; \
		echo "File .env generato con successo"; \
	fi

clean:
	@echo "Pulizia sistema Docker"
	@docker system prune -af
	@echo "Pulizia sistema Docker effetuata con successo"
