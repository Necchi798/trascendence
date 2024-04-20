document.addEventListener('DOMContentLoaded', () => {
	const registerButton = document.getElementById('LoginButton');
	registerButton.addEventListener('click', (event) => {
		event.preventDefault(); // Evita il comportamento predefinito del form
		fetchDataLogin();
	});
});

export function fetchDataLogin() {
	const name = document.getElementById('Name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const data = { name, password, email};
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
