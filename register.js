document.addEventListener('DOMContentLoaded', () => {
	const registerButton = document.getElementById('RegisterButton');
	registerButton.addEventListener('click', (event) => {
		event.preventDefault();
		fetchDataRegister();
	});
});


export function fetchDataRegister() {
	const password = document.getElementById('password').value;
	const confirmpassword = document.getElementById('confirmpassword').value;
	const email = document.getElementById('email').value;
	const nome = document.getElementById('Name').value;
	const cognome = document.getElementById('Surname').value;
	const data = { password, email , nome, cognome, confirmpassword};
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

