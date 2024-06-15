.PHONY: all enviroment clean

all: enviroment up

up : 
	@docker-compose up --build

down : 
	@docker-compose down


enviroment:
	@if [ -e .env ]; then \
		echo "Il file .env esiste."; \
	else \
		echo "Il file .env non esiste."; \
	fi



clean:
	@echo "Pulizia sistema Docker"
	@docker system prune -af
	@echo "Pulizia sistema Docker effetuata con successo"
