document.addEventListener('DOMContentLoaded', () => {
	const registerButton = document.querySelector('.btn.btn-primary.btn-block');
	registerButton.addEventListener('click', (event) => {
		event.preventDefault();
		fetchDataRegister();
	});
});


export function fetchDataRegister() {
	const login = document.getElementById('password').value;
	const password = document.getElementById('email').value;
	const nome = document.getElementById('Name').value;
	const cognome = document.getElementById('Surname').value;
	const data = { password, email , nome, cognome};
	fetch('https://jsonplaceholder.typicode.com/posts', { //sostituire con l'indirizzo del server impostato dal backend
		method: 'POST',
		headers: {
			'Content-Type': 'application/json' // Specifica il tipo di contenuto
		},
		body: JSON.stringify(data)	// Converte l'oggetto JavaScript in una stringa JSON
	})
	.then(response => response.json()) // Converte la risposta in un oggetto Json
	.then(data => {
		console.log('Success:', data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

