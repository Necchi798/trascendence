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

import "./components/profile_card.js"
import "./components/sidebar.js"
import "./components/friends_card.js"
import "./components/history_card.js"

export default  ()=> `
	<div class="d-flex flex-row">
		<side-bar>Trascendence</side-bar>
		<main id="content" class="d-flex w-100 vh-100 flex-row" >
            <div class="d-flex flex-column align-content-center" style=" width: 60%; padding: 3%; gap: 5%">
				<profile-card></profile-card>
                <history-card></history-card>
            </div>
            <div class="d-flex flex-column align-content-center" style="width: 40%; padding: 3%; padding-left: 0%">
				<friends-card></friends-card>
            </div>
        </main>
	</div>
`;

function fetchUserData()
{
	let userInfoDiv = document.getElementById("userInfoDiv");
	fetch("https://127.0.0.1:8000/user/",{
		method: "GET",
		mode: "cors",
		credentials: "include"
	}).then(response => {
		if(response.ok)
			return response.json();
		else
			throw new Error("Something went wrong");
	}).then(userData => {
		const nameSpan = userInfoDiv.querySelector('#name');
		if (nameSpan) {
			nameSpan.textContent = userData.username;
		}
		const mailSpan = userInfoDiv.querySelector('#email')
		if(mailSpan)
			mailSpan.textContent= userData.email;

		fetch("https://127.0.0.1:9001/get-history/", {
			method: "GET",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		}).then(async resHistory => await resHistory.json()).then(res => {
			const wins = res.data.filter(el=>el.winner === userData.username).length
			document.getElementById("wins").innerText= wins
			document.getElementById("losses").innerText= res.data.length - wins

			const table = document.getElementById("table");
			
			res.data.forEach(element => {
				const tableRow = document.createElement("tr");
				const date = new Date(element.ended_at);
				const options = { day: "2-digit", month: "2-digit", year: "numeric" };
				const formattedDate = new Intl.DateTimeFormat("it-IT", options).format(date);
				tableRow.innerHTML = `
					<td>${formattedDate}</td>
					<td>${element.player1 === userData.username ? element.player2 : element.player1}</td>
					<td>${element.winner === userData.username ? "win" : "loss"}</td>
				`;
				table.appendChild(tableRow);
			});
		});
	}).catch(error => {
		console.error('Error fetching data:', error);
	});
}

export function actionHome()
{
	fetchUserData();
}