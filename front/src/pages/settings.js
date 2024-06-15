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

//add buttons for settings
export default  ()=> `
	<div style="display: flex;flex-direction: row; margin:auto">
		<side-bar></side-bar>
		<main id="content" style="    width: 100%;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 3rem;" >
		<h2>Settings</h2>
			<div class="card" style="width: 100%;display: flex; padding:1rem">
				<h4>login options</h4>
				<div style="display: flex;  align-items: center ;height:120px; padding:1rem">
					<div style="display: flex; justify-content: space-between; align-items: center ;gap:2.2rem" id="div2FA">
						<button type="button" id="login42Button" class="btn btn-primary">Enable login with 42</button>
						<button type="button" id="twofaButton" class="btn btn-primary">
							Enable two-factor authentication
						</button>
					</div>
				</div>
			</div>
			<div class="card" style="width: 100%;display: flex;flex-direction: row; flex-wrap: wrap">
				<div class="card-body">
					<h3 class="card-title">Your Information</h3>
					<form id="updateForm">
						<div class="mb-3">
							<label for="emailChange" class="form-label">Email address</label>
							<input type="email" class="form-control" id="emailChange" disabled></input>
						</div>
						<div class="mb-3">
							<label for="passwordChange" class="form-label">Password</label>
							<input type="password" class="form-control" id="passwordChange" disabled></input>
						</div>
						<div class="mb-3">
							<label for="nameChange" class="form-label">Name</label>
							<input type="text" class="form-control" id="nameChange" disabled></input>
						</div>
						<button type="button" class="btn btn-primary" id="changeButton">Change</button>
					</form>
					<div class="d-flex mb-3"  style="margin-top:10px">
						<input id="fileInput" class="form-control" type="file" >
					</div>
					<button id="imgUpdate"  class="btn btn-primary">update img</button> 
				</div>
			</div>
		</main>
	</div>
`;

function imgUpdate(){
    const fileInput = document.getElementById('fileInput');
    const selectedFile = fileInput.files[0];
    
    if (!selectedFile) {
        console.error('Nessun file selezionato.');
        return;
    }
    
    const formdata = new FormData();
    formdata.append('avatar', selectedFile, selectedFile.name);

    const requestOptions = {
      method: 'PATCH',
      body: formdata,
      redirect: 'follow',
	  credentials:"include",
	  mode:"cors"
    };

    fetch('https://127.0.0.1:8000/avatar/', requestOptions)
      .then(response => response.text())
      .then(result => {document.getElementById("sidebar-component").maufetch()})
      .catch(error => console.error('Error:', error));
}
// add functions for settings (take them from home)
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
				document.getElementById("div2FA").removeChild(document.getElementById("div2FA").lastChild);
			}
			else
				console.log("QR code not deleted");
		}
	)
	.catch((error) => {
		console.error('Error:', error);
	});
}

function fetchShowQR(id)
{
	fetch("https://127.0.0.1:8001/qr/",{
		method: "GET",
		mode: "cors",
		credentials: "include"
	})
	.then(response => response.arrayBuffer())
    .then(buffer => {
      const imageData = new Blob([buffer], { type: 'image/png' });
      const imageURL = URL.createObjectURL(imageData);
      const img = document.createElement('img');
	  img.style.width = "100px"
	  img.src = imageURL;
	  document.getElementById("div2FA").appendChild(img);
    })
	.catch((error) => {
		console.error('Error:', error);
	});
}

function updateUserInfo()
{
	const email = document.getElementById("emailChange").value;
	const password = document.getElementById("passwordChange").value;
	const username = document.getElementById("nameChange").value;
	const data ={}
	console.log(email,username,password)
	if (email !== "")
		data["email"] = email
	if (username !== "")
		data["username"] = username
	if (password !== "")
		data["password"] = password
	console.log(data)
	fetch("https://127.0.0.1:8000/updateuser/",{
		method: "PATCH",
		mode: "cors",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({...data})
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		document.getElementById("name-sidebar").innerText = data.user.username
		disableUpdateForm();
	})
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
		buttonText = "Disable 2 Factor authentication";
		fun = fetchDisabletwofa;
		prev_fun = fetchEnabletwofa;
		field = "two_factor";
	}
	else if (data === "twofa" && val === false)
	{
		buttonText = "Enable 2 Factor authentication";
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
			//fetchSetMail(data);
			fetchUpdateUser("twofa", true, data);
			fetchShowQR(id);
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

function getOriginalUserInfo() {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		document.getElementById("emailChange").value = data.email;
		//document.getElementById("passwordChange").value = data.password;
		document.getElementById("nameChange").value = data.username;
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
		window.location.href = "https://127.0.0.1:4430/settings";
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

export function actionSettings() {
	const jwt = getCookieValue("jwt");
	fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		if (data.two_factor === true)
		{
			document.getElementById('twofaButton').textContent = "Disable 2 Factor authentication";
			document.getElementById('twofaButton').removeEventListener('click', fetchEnabletwofa);
			document.getElementById('twofaButton').addEventListener('click', fetchDisabletwofa);
		}
		else
		{
			document.getElementById('twofaButton').textContent = "Enable 2 Factor authentication";
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
		document.getElementById("emailChange").value = data.email;
		//document.getElementById("passwordChange").value = data.password;
		document.getElementById("nameChange").value = data.username;
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	document.getElementById("changeButton").addEventListener("click", enableUpdateForm);
	document.getElementById("imgUpdate").addEventListener("click",imgUpdate)

	const code = getQueryParameter('code');
	if (code)
	{
		console.log(code);
		searchUsertoEnable42(code);
	}
}
//in the same area of the settings for 2fa, add the qr code returned

//add the form to update user info
function disableUpdateForm()
{
	document.getElementById("emailChange").disabled = true;
	document.getElementById("passwordChange").disabled = true;
	document.getElementById("nameChange").disabled = true;
	getOriginalUserInfo();
	document.getElementById("changeButton").textContent = "Change";
	document.getElementById("changeButton").removeEventListener('click', updateUserInfo);
	document.getElementById("changeButton").addEventListener('click', enableUpdateForm);
	document.getElementById("updateForm").removeChild(document.getElementById("updateForm").lastChild);
}

function enableUpdateForm()
{
	document.getElementById("emailChange").disabled = false;
	document.getElementById("passwordChange").disabled = false;
	document.getElementById("nameChange").disabled = false;
	document.getElementById("changeButton").textContent = "Update";
	document.getElementById("changeButton").removeEventListener('click', enableUpdateForm);
	document.getElementById("changeButton").addEventListener('click', updateUserInfo);
	var resetButton = document.createElement("button");
	resetButton.textContent = "Reset";
	resetButton.type = "button";
	resetButton.className = "btn btn-secondary";
	resetButton.addEventListener("click", disableUpdateForm);
	document.getElementById("updateForm").appendChild(resetButton);
}