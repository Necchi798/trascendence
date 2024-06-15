import "./components/sidebar.js"
import "./components/players_fields.js"
import "./components/tournament_element.js"
import "./components/singlematch_element.js"
import { router } from "../main.js";

export default  ()=> `
	<div class="d-flex ">
		<side-bar></side-bar>
		<main id="contentMain" style="width: 100%;height: 100vh;overflow:hidden">
		<div class="d-flex justify-content-center align-items-center" >
			<h1 style=" font-size: 100px;">Pong Game 3D</h1>
		</div>
		<div class="d-flex flex-column justify-content-center align-items-center" >
			<div class="d-flex justify-content-center align-items-center">
				<button id="playButton" style=" font-size: 20px; margin-top: 30px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px">Play Single Match</button>
				<button id="tournamentButton" style=" font-size: 20px; margin-top: 30px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer; margin-left: 5px">Play Tournament</button>
			</div>
			<div class="d-flex flex-column justify-content-center align-items-center">
				<players-fields style="display: none;" tournament="false"></players-fields>
				<button id="startButton" disabled style="display: none; font-size: 20px; margin-top: 50px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer;">Start</button>
				<tournament-element style="display: none;"></tournament-element>
				<match-element style="display: none;"></match-element>
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
		displayTournament(res.tournament_id, res.players, playerNames);
	});
}

function updateTournamentElement(tournament_id, players_id, playerNames)
{
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
		if (res.message === "torneo finito")
		{
			var state = history.state;
			let winners = [state.winner_id];
			for (let i = 0; i < playerNames.length; i++)
			{
				if (winners.includes(players_id[i]))
				{
					document.getElementById("liplayer" + (i + 1)).style.backgroundColor = "#C1EBC5";
				}
			}
			tournamentElement.setPlayers(playerNames) 
			document.getElementById("startMatchButton").textContent = "Tournament ended";
			const btn = document.getElementById("startMatchButton");
			btn.removeEventListener("click", startTournamentMatch);
			btn.addEventListener("click", () => {
				history.replaceState({}, "", "/home");
				router();
			});
			return;
		}
		console.log(res.matches);
		console.log(res.matches.filter((el)=>!el.has_ended))
		let list_ids = [];
		let list_names = [];
		// update the tournament element (if none is ended)
		if (res.matches.length == 2 && res.matches.filter((el)=>!el.has_ended).length == 2)
		{
			console.log("ciao1");
			res.matches.forEach((el) => {
				list_ids.push(el.player1)
				list_ids.push(el.player2);
			});
			for (let i = 0; i < list_ids.length; i++)
			{
				for (let j = 0; j < players_id.length; j++)
				{
					if (list_ids[i] == players_id[j])
					{
						list_names.push(playerNames[j]);
					}
				}
			}
			console.log(list_ids);
			console.log(list_names);
		}
		else
		{
			list_ids = players_id;
			list_names = playerNames;
		}
		let matches_played = res.matches.filter((el)=>el.has_ended);
		if (matches_played.length == 1 || res.matches.length == 1)
		{
			let winners = [];
			if (matches_played.length == 1)
			{
				for (let i = 0; i < matches_played.length; i++)
				{
					winners.push(matches_played[i].winner);
				}
			}
			else
			{
				winners.push(res.matches[0].player1);
				winners.push(res.matches[0].player2);
			}
			for (let i = 0; i < list_names.length; i++)
			{
				if (winners.includes(players_id[i]))
				{
					document.getElementById("liplayer" + (i + 1)).style.backgroundColor = "#C1EBC5";
				}
			}
		}
		let nextmatch = res.matches.filter((el)=>!el.has_ended)[0];
		const startButton = document.getElementById("startMatchButton");
		console.log("ciao");
		tournamentElement.setPlayers(list_names);
		console.log("ciao");
		for (let i = 0; i < playerNames.length; i++)
		{
			if (players_id[i] == nextmatch.player1)
			{
				var player1 = playerNames[i];
			}
			if (players_id[i] == nextmatch.player2)
			{
				var player2 = playerNames[i];
			}
		}
		startButton.textContent = "Start Match: " + player1 + " vs " + player2;
		startButton.addEventListener("click", () => startTournamentMatch(tournament_id, res.matches, list_ids, list_names));
	});
}

function startTournamentMatch(tournament_id, matches, players_id, playerNames)
{
	let nextmatch = matches.filter((el)=>!el.has_ended)[0];
	history.replaceState({tournament_id, nextmatch, playerNames, players_id}, "", "/game3d");
	router();
}


function displayTournament(tournament_id, players_id, playerNames, tournament_started = false) {
	console.log(tournament_id);
	if (tournament_started == true)
	{
		const tournamentElement = document.querySelector("tournament-element");
		// make everything else display: none
		const playButton = document.getElementById("playButton");
		playButton.style.display = "none";
		tournamentElement.style.display = "block";
		updateTournamentElement(tournament_id, players_id, playerNames);
	}
	else
	{
		const startButton = document.getElementById("startButton");
		const tournamentElement = document.querySelector("tournament-element");
		const playerFields = document.querySelector("players-fields");
		startButton.style.transform = "translateY(1000px)";
		startButton.style.transition = "transform 1s";
		
		playerFields.style.transform = "translateY(1000px)";
		playerFields.style.transition = "transform 1s";
		// change the texts of the tournament element
	// create the tournament element
	setTimeout(() => {
		playerFields.style.display = "none";
		startButton.style.display = "none";
		tournamentElement.style.display = "block";
		updateTournamentElement(tournament_id, players_id, playerNames);
	}, 1000);
	}
}

// function called when start is clicked
function startSingleMatch() {
	const playerFields = document.querySelector("players-fields");
	const playerNames = playerFields.getPlayers();
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
		const matchElement = document.querySelector("match-element");
		document.getElementById("startButton").style.display = "none";
		const startButton = document.getElementById("startSingleMatchButton");
		matchElement.style.display = "block";
		console.log("player names: ", playerNames);
		matchElement.setPlayers(playerNames);
		playerFields.style.display = "none";
		// hide the start button
		startButton.textContent = "Start Match: " + playerNames[0] + " vs " + playerNames[1];
		startButton.style.display = "block";
		startButton.addEventListener("click", () => {
			history.replaceState({ match_id: res.match_id, players: res.players, player_names: playerNames }, "", "/game3d");
			router();
			return;
		});
	});
	
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

export function actionChallenge3D() {
	console.log("challenge page 3D loaded");
	const state = history.state;
	if (state)
	{
		console.log(state);
		if (state.tournament_id)
		{
			displayTournament(state.tournament_id, state.players_id, state.playerNames, true);
		}
		else
		{
			const matchElement = document.querySelector("match-element");
			matchElement.style.display = "block";
			matchElement.setPlayers(state.player_names);
			const startButton = document.getElementById("startSingleMatchButton");
			// if it has an event listener, remove it
			startButton.removeEventListener("click", startSingleMatch);
			startButton.style.display = "block";
			document.getElementById("tournamentButton").style.display = "none";
			startButton.textContent = "Home";
			startButton.addEventListener("click", () => {
				history.replaceState({}, "", "/home");
				router();
				return;
			});
			return;
		}
	}
	const playButton = document.getElementById("playButton");
	const tournamentButton = document.getElementById("tournamentButton");
	const playerFields = document.querySelector("players-fields");
	playerFields.addEventListener("input", checkFields);
	playButton.addEventListener("click", playSingleMatch);
	tournamentButton.addEventListener("click", playTournament);
}

// function called every time the focus is changed on a different element of the page
// check if the player fields are filled and the logged user is selected
export function checkFields() {
	const startButton = document.getElementById("startButton");
	const playerFields = document.querySelector("players-fields");
	startButton.disabled = false;
	if (!playerFields.isFilled()){
		console.log("notfilled")
		startButton.disabled = true;
	}
	else
	{
		if (playerFields.getAttribute("tournament") === "true" ){
			console.log("torneo")
			var p1 = document.querySelector("#player1").value;
			var p2 = document.querySelector("#player2").value;
			var p3 = document.querySelector("#player3").value;
			var p4 = document.querySelector("#player4").value;
			if(p1 === p2 )
				startButton.disabled = true;
			if(p1 === p3 )
				startButton.disabled = true;
			if(p1 === p4 )
				startButton.disabled = true;
			if(p2 === p3 )
				startButton.disabled = true;
			if(p2 === p4 )
				startButton.disabled = true;
			if(p3 === p4 )
				startButton.disabled = true;
		}
		if (playerFields.getAttribute("tournament") === "false"){
			var p11 = document.querySelector("#player1").value;
			var p22 = document.querySelector("#player2").value;
			console.log(p11,p22, p11 === p22)
			if(p11 === p22){
				startButton.disabled = true;

			}
		}
	}

}