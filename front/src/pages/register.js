import {router} from "../main.js";

export function registerStyle()
{
	const styleElement = document.createElement("style");
	styleElement.id = "registerStyle";
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
<div class="background d-flex" style="		display: flex;
align-items: center;
height: 100vh;
background-color: #00224D;">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-12">
				<div class="form-box">
					<h1 class="text-center">Register</h1>
					<div class="alert alert-danger" id="alertDiv">
						<strong id="alertStrong">Error:</strong>
					</div>
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

export async function fetchDataRegister() {
	document.getElementById("alertDiv").style.display = "none";
	//remove the text from the alert div
	document.getElementById("alertDiv").innerHTML = "";
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;
	const nome = document.getElementById('Name').value;
	const confirmpassword = document.getElementById("confirmpassword" ).value
	if(confirmpassword !== password){
		document.getElementById('alertDiv').style.display = "block";
		document.getElementById('alertDiv').innerHTML += "password mismatch";
		return
	}
	 
	const data = { password, email , username:nome,};
	try{
	const resRegister = await fetch('https://127.0.0.1:8000/register/', { 
		method: 'POST',
		mode:"cors",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	if (!resRegister.ok) {
		const errorData = await resRegister.json();
		throw new Error(JSON.stringify(errorData));
	}
	const registerData = await resRegister.json()
	const playerRes = await fetch("https://127.0.0.1:9001/create-player/", {
		method: "POST",
		mode:"cors",
		credentials:"include",
		headers:{
			"Content-Type": "application/json"
		},
		body: JSON.stringify({name: nome, id: registerData.id})
	})
	document.getElementById("registerStyle").remove();
	history.pushState({}, "", "/login");
	router();
	
	}catch(error) {
		console.log(error)
		const  data = JSON.parse(error.message);
		console.log(data)
		document.getElementById('alertDiv').style.display = "block";
		document.getElementById('alertDiv').innerHTML = ""
		if (data.detail)
		{
			document.getElementById('alertDiv').innerHTML += data.detail;
		}
		else
		{
			if (data.username && data.email)
			{
				document.getElementById('alertDiv').innerHTML += data.username + "<br>";
				document.getElementById('alertDiv').innerHTML += data.email;
			}
			else if (data.username)
			{
				document.getElementById('alertDiv').innerHTML += data.username;
			}
			else if (data.email)
			{
				document.getElementById('alertDiv').innerHTML += data.email;
			}
		}
	};
}

export function actionRegister() {
	var style = document.getElementById("registerStyle");
	if (style == null)
	{
		document.head.appendChild(registerStyle());
	}
	document.getElementById("alertDiv").style.display = "none";
	document.getElementById('RegisterButton').addEventListener('click', (e)=>{e.preventDefault();fetchDataRegister()});
}
