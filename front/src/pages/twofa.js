import {router} from "../main.js";

export default ()=> `
<div class="container">
	<div class="row justify-content-center">
		<div class="col-12">
			<div class="form-box">
				<h1 class="text-center">two factor authentication</h1>
				<form>
					<div class="d-flex justify-content-between">
						<input type="text" id="otpField" class="form-control" placeholder="code">
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

async function twofaLogin(userdata)
{
	const username = userdata.username;
	const password = userdata.password;
	const otp = document.getElementById("otpField").value;
	const response = await fetch("https://127.0.0.1:8000/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({username: username, password: password, otp: otp})
	});
	const data = await response.json();
	if(data.success)
	{
		history.pushState({},"","/");
		router();
	}
	else
	{
		console.log(data);
	}
}

export function twofaScript(userdata)
{
	console.log(userdata);
	document.getElementById("loginButton").addEventListener("click", twofaLogin.bind(null, userdata));
}