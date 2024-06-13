import "./components/sidebar.js"
import "./components/players_fields.js"
import "./components/tournament_element.js"
import { router } from "../main.js";

export default  ()=> `
	<div style="display: flex;flex-direction: row;">
		<side-bar></side-bar>
		<main id="contentMain" style="width: 100%;height: 100vh;overflow:hidden">
		<div style="display: flex; justify-content: center; align-items: center ">
			<h1 style="font-family: 'Silkscreen', sans-serif; font-size: 100px;">Pong Game</h1>
		</div>
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
			<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
				<button id="playButton" style="font-family: 'Silkscreen', sans-serif; font-size: 20px; margin-top: 30px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px">Play Single Match</button>
				<button id="tournamentButton" style="font-family: 'Silkscreen', sans-serif; font-size: 20px; margin-top: 30px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer; margin-left: 5px">Play Tournament</button>
			</div>
			<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
				<players-fields style="display: none;" tournament="false"></players-fields>
				<button id="startButton" disabled style="display: none;font-family: 'Silkscreen', sans-serif; font-size: 20px; margin-top: 50px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer;">Start</button>
				<tournament-element style="display: none;"></tournament-element>
			</div>
		</div>
		</main>
	</div>
`;

function createTournament() {
	const playerFields = document.querySelector("players-fields");
	const playerNames = playerFields.getPlayers();
	console.log(playerNames);
	const data = { names: playerNames };
	fetch("https://127.0.0.1:9001/create-challenge/", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
	.then(async (res) => await res.json())
	.then((res) => {
		console.log(res);
		displayTournament(res.tournament_id, res.players);
	});
}

function startTournamentMatch(tournament_id, players_id)
{
	const playerFields = document.querySelector("players-fields");
	const playerNames = playerFields.getPlayers();
	const tournamentElement = document.querySelector("tournament-element");
	const data = { tournament_id: tournament_id };
	fetch('https://127.0.0.1:9001/get-next-match/', { //sostituire con l'indirizzo del server impostato dal backend
		method: 'POST',
		mode:"cors",
		credentials: 'include', 
		headers: {
		'Content-Type': 'application/json' // Specifica il tipo di contenuto
		},
		body: JSON.stringify(data)
	}).then(async res=>await res.json()).then(res=>{
		console.log(res.matches.filter((el)=>!el.has_ended[0]));
		let nextmatch = res.matches.filter((el)=>!el.has_ended)[0];
		history.pushState({tournament_id, nextmatch, playerNames, players_id}, "", "/game");
		router();
	});
}


function displayTournament(tournament_id, players_id) {
	console.log(tournament_id);
	const playerFields = document.querySelector("players-fields");
	const playerNames = playerFields.getPlayers();
	const startButton = document.getElementById("startButton");
	const tournamentElement = document.querySelector("tournament-element");
	startButton.style.transform = "translateY(1000px)";
	startButton.style.transition = "transform 1s";
	
	playerFields.style.transform = "translateY(1000px)";
	playerFields.style.transition = "transform 1s";
	// change the texts of the tournament element
	tournamentElement.setPlayers(playerNames);
	// create the tournament element
	setTimeout(() => {
		playerFields.style.display = "none";
		startButton.style.display = "none";
		tournamentElement.style.display = "block";
		tournamentElement.addEventListener("click", startTournamentMatch.bind(null, tournament_id, players_id));
	}, 1000);
}

// function called when start is clicked
function startSingleMatch() {
	const playerFields = document.querySelector("players-fields");
	const startButton = document.getElementById("startButton");
	const contentMain = document.getElementById("contentMain");
	// remove all the children of the main content
	contentMain.innerHTML = "";
}

function playSingleMatch() {
	const playButton = document.getElementById("playButton");
	const tournamentButton = document.getElementById("tournamentButton");
	const playerFields = document.querySelector("players-fields");
	const startButton = document.getElementById("startButton");
	//animate the button to move down
	tournamentButton.style.transform = "translateY(1000px)";
	tournamentButton.style.transition = "transform 1s";
	//align the button to the center
	playButton.style.transform = "translateX(50%)";
	playButton.style.transition = "transform 1s";
	// show the player fields
	setTimeout(() => {
		playerFields.style.display = "block";
		startButton.style.display = "block";
		startButton.addEventListener("click", startSingleMatch);
	}, 1000);
	playButton.removeEventListener("click", playSingleMatch);
}

function playTournament() {
	const playButton = document.getElementById("playButton");
	const tournamentButton = document.getElementById("tournamentButton");
	const playerFields = document.querySelector("players-fields");
	const startButton = document.getElementById("startButton");
	playerFields.setAttribute("tournament", "true");
	//animate the button to move down
	playButton.style.transform = "translateY(1000px)";
	playButton.style.transition = "transform 1s";
	//align the button to the center
	tournamentButton.style.transform = "translateX(-50%)";
	tournamentButton.style.transition = "transform 1s";
	// wait for the animation to end
	setTimeout(() => {
		playerFields.style.display = "block";
		startButton.style.display = "block";
		startButton.addEventListener("click", createTournament);
	}, 1000);
	tournamentButton.removeEventListener("click", playTournament);
}

export function actionChallenge() {
	console.log("challenge page loaded");
	const playButton = document.getElementById("playButton");
	const tournamentButton = document.getElementById("tournamentButton");
	const playerFields = document.querySelector("players-fields");
	const startButton = document.getElementById("startButton");
	playerFields.addEventListener("input", checkFields);
	playButton.addEventListener("click", playSingleMatch);
	tournamentButton.addEventListener("click", playTournament);
}

// function called every time the focus is changed on a different element of the page
// check if the player fields are filled and the logged user is selected
export function checkFields() {
	const startButton = document.getElementById("startButton");
	const playerFields = document.querySelector("players-fields");
	startButton.disabled = playerFields.isFilled() ? false : true;
}