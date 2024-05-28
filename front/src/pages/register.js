export default  ()=> `
<div class="background d-flex" style="		display: flex;
align-items: center;
height: 100vh;
background-color: #00224D;">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-12">
				<div class="form-box">
					<h1 class="text-center">Register</h1>
					<form>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-user"></i></span>
							<input type="text" id="Name" class="form-control" placeholder="Name">
						</div>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-envelope"></i></span>
							<input type="email" id="email" class="form-control" placeholder="Email">
						</div>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-lock"></i></span>
							<input type="password" id="password" class="form-control" placeholder="Password">
						</div>
						<div>
						<div class="mb-3 input-group">
							<span class="input-group-text"><i class="fas fa-lock"></i></span>
							<input type="password" id="confirmpassword" class="form-control" placeholder="Confirm Password">
						</div>
						<div class="d-flex flex-column justify-content-center align-items-center">
						<span>have an account? <a data-link href="/login" >Login</a></span>
							<button  id="RegisterButton" class="btn btn-primary mx-2">Sgn up</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	</div>
	`;

export function fetchDataRegister() {
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;
	const nome = document.getElementById('Name').value;
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
