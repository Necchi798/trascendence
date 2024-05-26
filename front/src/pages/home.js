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
                <div class="d-flex justify-content-between">
                    <label for="login42Button"></label>
                    <button type="button" id="login42Button" class="btn btn-primary">Login 42</button>
                    <label for="twofaButton"></label>
                    <button type="button" id="twofaButton" class="btn btn-primary">Enable 2FA</button>
                    <label for="twofaDelButton"></label>
                    <button type="button" id="twofaDelButton" class="btn btn-primary">Erase qr code</button>
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
            {
                console.log("QR code deleted");
            }
            else
            {
                console.log("QR code not deleted");
            }
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
                fetchUpdateUser({id, email, username, two_factor: false});
            }
            else
            {
                console.log("QR code not deleted");
            }
        }
    )
    .catch((error) => {
        console.error('Error:', error);
    });
}


function fetchUpdateUser(data)
{
    var buttonText;
    var fun;
    var prev_fun = document.getElementById('twofaButton').onclick;
    if (data.two_factor === true)
    {
        buttonText = "Disable 2FA";
        fun = fetchDisabletwofa;
    }
    else
    {
        buttonText = "Enable 2FA";
        fun = fetchEnabletwofa;
    }
    fetch("https://127.0.0.1:8000/updateuser/",{
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('twofaButton').textContent = buttonText;
        document.getElementById('twofaButton').removeEventListener('click', prev_fun);
        document.getElementById('twofaButton').addEventListener('click', fun);
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
            fetchUpdateUser({id, email, username, two_factor: true});
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

export function fetchDisabletwofa() {
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


export function fetchEnabletwofa() {
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

export function checkUser() {
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

export function actionHome() {
	document.getElementById('twofaButton').addEventListener('click', fetchEnabletwofa);
    document.getElementById('login42Button').addEventListener('click', checkUser);
    document.getElementById('twofaDelButton').addEventListener('click', fetchDeleteQRCodeButton);
}