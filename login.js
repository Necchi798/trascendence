// login.js

export function handleLogin() {
    const loginButton = document.querySelector('.btn.btn-primary'); // Seleziona il pulsante di submit
    loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previene il comportamento predefinito del modulo di login (invio del form)
        fetchData(); // Chiama la funzione fetchData() quando viene cliccato il pulsante di submit
    });
}

export function fetchData() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('pwd').value;
    const data = { login, password };
    fetch('https://jsonplaceholder.typicode.com/posts', { //sostituire con l'indirizzo del server impostato dal backend oppure testare con "fetch('https://jsonplaceholder.typicode.com/posts'"
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
