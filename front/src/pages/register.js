export function RegisterStyle()
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
8
	.form-box h1::after {
		content: '';
		width: 30px;
		height: 4px;
		border-radius: 3px;
		position: absolute;
		background: #00224D;
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
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
					<h1 class="text-center">Register</h1>
					<form>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-user"></i></span>
							<input type="text" id="Name" class="form-control" placeholder="Name">
							<span class="input-group-text"><i class="fas fa-user"></i></span>
							<input type="text" id="Surname" class="form-control" placeholder="Surname">
						</div>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-envelope"></i></span>
							<input type="email" id="email" class="form-control" placeholder="Email">
						</div>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-lock"></i></span>
							<input type="password" id="password" class="form-control" placeholder="Password">
						</div>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-lock"></i></span>
							<input type="password" id="confirmpassword" class="form-control" placeholder="Confirm Password">
						</div>
						<div class="d-flex justify-content-center">
							<button type="button" id="RegisterButton" class="btn btn-primary mx-2">Sign up</button>
							<a data-link href="/login" id="LoginButton" class="btn btn-primary mx-2">Sign In</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	`;

export function fetchDataRegister() {
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;
	const nome = document.getElementById('Name').value;
	const cognome = document.getElementById('Surname').value;
	const data = { password, email , username:nome,};
	fetch('https://127.0.0.1:8000/register/', { //sostituire con l'indirizzo del server impostato dal backend
		method: 'POST',
		mode:"cors",
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

export function actionRegister() {
	document.getElementById('RegisterButton').addEventListener('click', fetchDataRegister);
}
