import { makeGame } from "../2Dpong/game.js";
import "./components/profile_card.js"
import "./components/sidebar.js"

function getCookieValue(cookieName) {
	// Dividi la stringa dei cookie in cookie individuali
	var cookies = document.cookie.split("; ");
	
	// Cerca il cookie desiderato utilizzando Array.find()
	var cookie = cookies.find(function(cookie) {
		// Dividi il cookie in nome e valore
		var parts = cookie.split("=");
		var cookieNameTrimmed = parts[0].trim();
		// Restituisci il cookie se il nome corrisponde a quello cercato
		return cookieNameTrimmed === cookieName;
	});
	
	// Se il cookie è stato trovato, restituisci il suo valore, altrimenti restituisci null
	return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export default  ()=> `
	<div style="display: flex;flex-direction: row;">
		<side-bar>Trascendence</side-bar>
		<main id="content" style="width: 100%;height: 100vh;">
			<div style="width: 100%; height: 100% ;display:flex; flex-direction: column;flex-wrap: wrap;align-content: center;
					justify-content: space-around;">
				<profile-card></profile-card>
				<h2> Settings </h2>
				<div style="display: flex; justify-content: space-between; align-items: center ">
					<div style="display: flex; justify-content: space-between; align-items: center ">
						<span>Enable two-factor authentication</span>
						<button type="button" id="twofaButton" class="btn btn-primary">Enable 2FA</button>
					</div>
					<hr></hr>
					<div style="display: flex; justify-content: space-between; align-items: center ">
						<span>Enable login with 42</span>
						<button type="button" id="login42Button" class="btn btn-primary">Enable login 42</button>
					</div>
					<hr></hr>
					<div style="display: flex; justify-content: space-between; align-items: center ">
						<span>Force delete of 42 User</span>
						<button type="button" id="delete42Button" class="btn btn-primary">Delete 42 User</button>
					</div>
					<hr></hr>
					<div style="display: flex; justify-content: space-between; align-items: center ">
						<span>Force delete of 2FA</span>
						<button type="button" id="delete2faButton" class="btn btn-primary">Delete 2FA</button>
					</div>
					<hr></hr>
					<div style="display: flex; justify-content: space-between; align-items: center ">
						<span>log info of the user</span>
						<button type="button" id="UserButton" class="btn btn-primary">user</button>
					</div>
				</div>
			</div>
		</main>
	</div>
`;

function fetchDeleteQRCodeButton()
{
	const data = {id: 1}
	fetch("https://127.0.0.1:8001/qr/",{
		method: "DELETE",
		mode: "cors",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(response => 
		{
			if (response.ok)
				console.log("QR code deleted");
			else
				console.log("QR code not deleted");
		}
	)
	.catch((error) => {
		console.error('Error:', error);
	});
}

function fetchDeleteQRCode(data)
{
	fetch("https://127.0.0.1:8001/qr/",{
		method: "DELETE",
		mode: "cors",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(response => 
		{
			if (response.ok)
			{
				console.log("QR code deleted");
				fetchUpdateUser("twofa", false, data);
			}
			else
				console.log("QR code not deleted");
		}
	)
	.catch((error) => {
		console.error('Error:', error);
	});
}


function fetchUpdateUser(data, val, userdata)
{
	var buttonText;
	var button;
	var fun;
	var prev_fun;
	var field;
	button = data + "Button";
	if (data === "twofa" && val === true)
	{
		buttonText = "Disable 2FA";
		fun = fetchDisabletwofa;
		prev_fun = fetchEnabletwofa;
		field = "two_factor";
	}
	else if (data === "twofa" && val === false)
	{
		buttonText = "Enable 2FA";
		fun = fetchEnabletwofa;
		prev_fun = fetchDisabletwofa;
		field = "two_factor";
	}
	else if (data === "login42" && val === true)
	{
		buttonText = "Disable login 42";
		fun = fetchDisableLogin42;
		prev_fun = fetchEnableLogin42;
		field = "api42";
	}
	else if (data === "login42" && val === false)
	{
		buttonText = "Enable login 42";
		fun = fetchEnableLogin42;
		prev_fun = fetchDisableLogin42;
		field = "api42";
	}
	userdata[field] = val;
	fetch("https://127.0.0.1:8000/updateuser/",{
		method: "PATCH",
		mode: "cors",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userdata)
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		document.getElementById(button).textContent = buttonText;
		document.getElementById(button).removeEventListener('click', prev_fun);
		document.getElementById(button).addEventListener('click', fun);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function fetchGenerateQRCode(data)
{
	const id = data.id;
	const email = data.email;
	const username = data.username;
	fetch("https://127.0.0.1:8001/qr/",{
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({id, email, username})
	})
	.then(response => {
		if (response.ok)
		{
			console.log("QR code generated");
			fetchUpdateUser("twofa", true, data);
		}
		else
		{
			console.log("QR code not generated");
		}
		return response.status;
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function fetchDisabletwofa() {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		fetchDeleteQRCode(data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function fetchEnabletwofa() {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		fetchGenerateQRCode(data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function searchUser() {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

// function to search a 42 user in the db
function fetchSearch42User()
{
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8002/enable42/",{
		method: "GET",
		mode: "cors",
		credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

// function to delete a 42 user in the db
function fetchDisableLogin42(userdata)
{
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8002/disable42/",{
		method: "POST",
		mode: "cors",
		credentials: "include",
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		fetchUpdateUser("login42", false, userdata);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function fetchDisableLogin42Button()
{
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8002/disable42/",{
		method: "POST",
		mode: "cors",
		credentials: "include",
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		fetchUpdateUser("login42", false, {id: 1});
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

// function to create a 42 user in the db
function fetchCreate42User(userdata, code)
{
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8002/enable42/",{
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({code})
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		fetchUpdateUser("login42", true, userdata);
		window.location.href = "https://127.0.0.1:4430/";
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function searchUsertoDisable42() {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		fetchDisableLogin42(data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function searchUsertoEnable42(code) {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		fetchCreate42User(data, code);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

// function to ask access to 42 api
function fetchEnableLogin42() {
	const jwt = getCookieValue("jwt");
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

function getQueryParameter(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}


export function actionHome() {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		if (data.two_factor === true)
		{
			document.getElementById('twofaButton').textContent = "Disable 2FA";
			document.getElementById('twofaButton').removeEventListener('click', fetchEnabletwofa);
			document.getElementById('twofaButton').addEventListener('click', fetchDisabletwofa);
		}
		else
		{
			document.getElementById('twofaButton').textContent = "Enable 2FA";
			document.getElementById('twofaButton').removeEventListener('click', fetchDisabletwofa);
			document.getElementById('twofaButton').addEventListener('click', fetchEnabletwofa);
		}
		if (data.api42 === true)
		{
			document.getElementById('login42Button').textContent = "Disable login 42";
			document.getElementById('login42Button').removeEventListener('click', fetchEnableLogin42);
			document.getElementById('login42Button').addEventListener('click', fetchDisableLogin42);
		}
		else
		{
			document.getElementById('login42Button').textContent = "Enable login 42";
			document.getElementById('login42Button').removeEventListener('click', fetchDisableLogin42);
			document.getElementById('login42Button').addEventListener('click', fetchEnableLogin42);
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	document.getElementById('delete42Button').addEventListener('click', fetchDisableLogin42Button);
	document.getElementById('delete2faButton').addEventListener('click', fetchDeleteQRCodeButton);
	document.getElementById('UserButton').addEventListener('click', searchUser);
	const code = getQueryParameter('code');
	if (code)
	{
		console.log(code);
		searchUsertoEnable42(code);
	}
}