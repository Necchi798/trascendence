class loginCard extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="container">
            <form>
                <div class="mb-3 mt-3">
                    <label for="login" class="form-label">Login:</label>
                    <input type="text" class="form-control" id="login" placeholder="Enter login" name="login">
                </div>
                <div class="mb-3">
                    <label for="pwd" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="pwd" placeholder="Enter password" name="pswd">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
        <div class="container">
            <h2>Never played before? Register now!</h2>
            <button type="submit" class="btn btn-primary">Register</button>
        </div>
        `
    }
}

function handleLogin() {
    const loginButton = document.querySelector('.btn.btn-primary'); // Seleziona il pulsante di submit
    loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previene il comportamento predefinito del modulo di login (invio del form)
        fetchData(); // Chiama la funzione fetchData() quando viene cliccato il pulsante di submit
    });
}

function fetchData() {
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
customElements.define("login-card",loginCard)