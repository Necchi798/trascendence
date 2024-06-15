import {router} from "../main.js";

export function loginStyle()
{
	const styleElement = document.createElement("style");
	styleElement.id = "loginStyle";
	styleElement.textContent =`
	.pippo {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #00224D;
		background-size: cover;
		margin: 0;
		background-position: center;
		background-size: cover;
	}

	.container {
		width:fit-content;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 15px;
		box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
		overflow: auto;
	}

	.form-box {
		padding: 50px 60px 60px;
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

	`;
	return styleElement;
}

export default  ()=> `
<div class="pippo">
<div class="container">
	<div class="row justify-content-center">
		<div class="col-12">
			<div class="form-box">
				<h1 class="text-center">Login</h1>
				<div id="alertDiv" class="alert alert-warning" role="alert" style="display:none"></div>
				<form id="formLogin" class="needs-validation">
					<div class="mb-3 input-group">
						<span class="input-group-text"><i class="fas fa-user"></i></span>
						<input type="text" id="Name" class="form-control" required placeholder="Name">
					</div>
					<div class="mb-3 input-group">
						<span class="input-group-text"><i class="fas fa-lock"></i></span>
						<input type="password" id="password" class="form-control" required placeholder="Password">
					</div>
					<div class="d-flex flex-column justify-content-center align-items-center">
						<span>Dont have an account? <a data-link href="/register" id="RegisterButton">Sign up</a></span>
						<button type="button" id="LoginButton" class="btn btn-primary mx-2">Sign In</button>
					</div>
				</form>
				<hr></hr>
				<form id="formLogin42" class="needs-validation">
					<div class="d-flex flex-column justify-content-center align-items-center">
						<button type="button" id="Login42Button" class="btn btn-primary mx-2">Login 42</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
</div>
`;

function fetchDataLogin42() {
	fetch("https://127.0.0.1:8002/api-auth/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		window.location.href = data.url;
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

export function fetchDataLogin() {
	document.getElementById("alertDiv").style.display = "none";
	//remove the text from the alert div
	document.getElementById("alertDiv").innerHTML = "";
	const name = document.getElementById('Name').value;
	const password = document.getElementById('password').value;
	const data = {  password:password, username:name, otp: 0};
	
	fetch('https://127.0.0.1:8000/login/', { //sostituire con l'indirizzo del server impostato dal backend
		method: 'POST',
		mode:"cors",
		credentials: 'include',
	headers: {
		'Content-Type': 'application/json' // Specifica il tipo di contenuto
	},
	body: JSON.stringify(data)	// Converte l'oggetto JavaScript in una stringa JSON
	})
	.then(response => response.json())
	.then(response_data => {
		if(response_data.jwt)
		{
			console.log("cookie: ",document.cookie,"ce sta" ,document.cookie.includes("jwt"))
			
			document.getElementById("loginStyle").remove();
			history.pushState({},"","/")
			router();
		}
		else
		{
			console.log(response_data);
			var response_msg = response_data.detail;
			console.log(response_msg);
			if (response_msg == "OTP required!")
			{
				history.pushState({username: name, password: password, id: response_data.id},"","/twofa")
				router();
				return;
			}
			else
			{
				document.getElementById('alertDiv').style.display = "block";
				document.getElementById('alertDiv').innerHTML = response_msg;
			}
		}
	})
}

function getQueryParameter(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}

function needToRegisterModal()
{
	console.log("needToRegisterModal");
	const modal = document.createElement("div");
	modal.id = "modal";
	modal.className = "modal";
	modal.innerHTML = `
		<div class="modal-dialog">
			<div class="modal-content">

			<div class="modal-header">
				<h4 class="modal-title">Error: no user found</h4>
				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
			</div>

			<!-- Modal body -->
			<div class="modal-body">
				You need to register to login in with 42
			</div>

			<!-- Modal footer -->
			<div class="modal-footer">
				<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
				<a href="/register" class="btn btn-primary">Register</a>
			</div>

			</div>
		</div>
	`;
	
	//remove modal using data-bs-dismiss
	document.body.appendChild(modal);
	const modalElement = new bootstrap.Modal(modal);
	modalElement.show();
	// event listener to remove the modal
	// event listener to remove the modal
	modal.addEventListener("hidden.bs.modal", () => {
		document.body.removeChild(modal);
	});
}

function searchToken(code) {
	fetch('https://127.0.0.1:8002/login42/', {
		method: 'POST',
		mode:"cors",
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json' // Specifica il tipo di contenuto
		},
		body: JSON.stringify({code:code})	// Converte l'oggetto JavaScript in una stringa JSON
	})
	.then(response => {
		if(response.ok){
			console.log(window.location.href)
			console.log(response)
			history.pushState({},"","/home")
			router()
		}
		else
		{
			console.log(response);
			if (response.status == 403)
			{
				history.replaceState({},"","/login");
				needToRegisterModal();
			}
		}
	})
}

export function actionLogin() {
	var style = document.getElementById("loginStyle");
	if (style == null)
	{
		document.head.appendChild(loginStyle());
	}
	document.getElementById('LoginButton').addEventListener("click",(e)=>{e.preventDefault() ;fetchDataLogin()});
	document.getElementById('Login42Button').addEventListener("click",(e)=>{e.preventDefault(); fetchDataLogin42()});
	const code = getQueryParameter('code');
	if (code)
	{
		console.log(code);
		searchToken(code);
	}
}
