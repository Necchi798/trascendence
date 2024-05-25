export function twofaStyle()
{
	const styleElement = document.createElement("style");
	styleElement.textContent =`
	body {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #00224D;
		background-position: center;
		background-size: cover;
		margin: 0;
		background-position: center;
		background-size: cover;
	}

	.container {
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 15px;
		box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
		overflow: auto;
	}

	.form-box {
		padding: 50px 60px 60px;
	}

	.form-box h1 {
		color: #00224D;
		font-size: 30px;
		margin-bottom: 30px;
		position: relative;
	}

	.input-group {
		margin-bottom: 10px;
	}

	.input-group-text {
		background-color: #EAEAEA;
		color: #999;
		border: none;
	}

	.input-group-text .fas {
		margin-right: 10px;
	}

	input.form-control {
		border-color: #EAEAEA;
		max-width: 100%;
		box-sizing: border-box;
	}

	.btn-primary {
		background-color: #00224D;
		border: none;
	}

	.btn-primary:hover {
		background-color: #00172F;
	}

	p {
		color: #999;
		margin-top: 10px;
	}
	`;
	return styleElement;
}

export default  ()=> `
<div class="container">
	<div class="row justify-content-center">
		<div class="col-12">
			<div class="form-box">
				<h1 class="text-center">two factor authentication</h1>
				<form>
					<div class="d-flex justify-content-between">
						<input type="text" id="code" class="form-control" placeholder="code">
						<button type="button" id="loginButton" class="btn btn-primary mx-2">Login</button>
					</div>
				</form>
				<hr>
				<form>
					<div class="d-flex justify-content-center">
						<button type="button" id="mailButton" class="btn btn-primary mx-2">Send a mail</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
`;

/* export function fetchDataLogin() {
	const name = document.getElementById('Name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const data = {  password:password, username:name};
	fetch('https://127.0.0.1:8000/login/', { //sostituire con l'indirizzo del server impostato dal backend
		method: 'POST',
		mode:"cors",
		credentials: 'include',
	headers: {
		'Content-Type': 'application/json' // Specifica il tipo di contenuto
	},
	body: JSON.stringify(data)	// Converte l'oggetto JavaScript in una stringa JSON
	})
	.then(response => {
		if(response.ok){
			console.log("successino")
			window.history.pushState(null,null,"/")
			router()
			return response.json()
		}
		else
			console.log(response)
			console.log("errorino")
	})
} */

/* export function actionLogin() {
	document.getElementById('LoginButton').addEventListener('click', fetchDataLogin);
} */
