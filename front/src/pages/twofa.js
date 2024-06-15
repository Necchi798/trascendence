import {router} from "../main.js";

export function twofaStyle()
{
	const styleElement = document.createElement("style");
	styleElement.id = "twofaStyle";
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

function twofaMail(id)
{
	console.log(id);
	fetch("https://127.0.0.1:8001/send_mail/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(id)
	}).then((res) => {
		if (res.ok)
		{
			console.log("mail sent");
		}
		else
		{
			console.log("error");
		}
	});
}

function twofaLogin(userdata)
{
	console.log("twofalogin", userdata);
	const username = userdata.username;
	const password = userdata.password;
	const otp = document.getElementById("otpField").value;
	fetch("https://127.0.0.1:8000/login/", {
		method: "POST",
		credentials: "include",
		mode:"cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({username: username, password: password, otp: otp})
	}).then((res) => {
		if (res.ok)
		{
			document.getElementById("twofaStyle").remove();
			history.pushState({},"","/");
			router();
		}
		else
		{
			console.log("error");
		}
	});
}

export function actionTwofa()
{
	var userdata = history.state;
	console.log(history.state);
	if (userdata == null)
	{
		history.pushState({},"","/login");
		router();
		return;
	}
	else
	{
		console.log("debug:", userdata);
	}
	var style = document.getElementById("twofaStyle");
	if (style == null)
	{
		document.head.appendChild(twofaStyle());
	}
	document.getElementById("loginButton").addEventListener("click", twofaLogin.bind(null, userdata));
	document.getElementById("mailButton").addEventListener("click", twofaMail.bind(null, userdata.id));
}