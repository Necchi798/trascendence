import { makeGame } from "./game.js";

function sendResult(winner, match_id){
	let data = {
		winner: winner,
		match_id:match_id
	}
	//localStorage.removeItem("match_id");
	fetch('https://127.0.0.1:9001/update-match-result/', { 
		method: 'POST',
		headers: {
			'Content-Type': 'application/json' 
		},
		body: JSON.stringify(data)
	}
	).then(()=>{
		console.log("Result sent");
		document.getElementById("content").innerHTML = "<h1>Game Over</h1>";
	})
}

function fakeGame(match_id, id_player1, id_player2, player1, player2)
{
	const content = document.getElementById("content");
	//create a button to make the player 1 win
	const player1WinButton = document.createElement("button");
	player1WinButton.id = "player1WinButton";
	player1WinButton.classList.add("btn");
	player1WinButton.classList.add("btn-primary");
	player1WinButton.innerHTML = player1 + " wins";
	content.appendChild(player1WinButton);
	//create a button to make the player 2 win
	const player2WinButton = document.createElement("button");
	player2WinButton.id = "player2WinButton";
	player2WinButton.classList.add("btn");
	player2WinButton.classList.add("btn-primary");
	player2WinButton.innerHTML = player2 + " wins";
	content.appendChild(player2WinButton);
	//add event listeners to the buttons
	player1WinButton.addEventListener("click", () => {
		player1WinButton.remove();
		player2WinButton.remove();
		sendResult(id_player1, match_id);
	});
	player2WinButton.addEventListener("click", () => {
		player1WinButton.remove();
		player2WinButton.remove();
		sendResult(id_player2, match_id);
	});
}

function getMatchInfo2(match_id)
{
	fetch("https://127.0.0.1:9001/create-challenge/?" + new URLSearchParams({"match_id": match_id}), {
		method: "GET",
		mode: "cors"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		console.log(data.match);
		//makeGame(match_id, data.match.player1, data.match.player2, player1, player2);
	})
	.catch(error => console.error(error));
}

function getMatchInfo(match_id, player1, player2)
{
	fetch("https://127.0.0.1:9001/create-challenge/?" + new URLSearchParams({"match_id": match_id}), {
		method: "GET",
		mode: "cors"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		console.log(data.match);
		makeGame(match_id, data.match.player1, data.match.player2, player1, player2);
	})
	.catch(error => console.error(error));
}

function getNextMatch(tournament_id)
{
	fetch("https://127.0.0.1:9001/get-next-match/", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			tournament_id: tournament_id
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		let nextMatch = data.matches.filter(el => !el.has_ended)[0];
		console.log(nextMatch);
		//getMatchInfo2(nextMatch.id);
	})
	.catch(error => console.error(error));
}

function fetchCreateTournament(player1, player2, player3, player4)
{
	/* fetch("https://127.0.0.1:9001/create-challenge/", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			names: [player1, player2, player3, player4]
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		getNextMatch(data.tournament_id);
	})
	.catch(error => console.error(error)); */
	getNextMatch(1);
}

function fetchCreateMatch(player1, player2)
{
	fetch("https://127.0.0.1:9001/create-challenge/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			names: [player1, player2]
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		getMatchInfo(data.match_id, player1, player2);
		//fakeGame(data.match_id, player1, player2);
		//makeGame(data.match_id, player1, player2);
	})
	.catch(error => console.error(error));
}

export function startGame()
{
	// create 2 buttons: Play 1v1 and Propose a tournament
	const playButton = document.createElement("button");
	playButton.id = "playButton";
	playButton.classList.add("btn");
	playButton.classList.add("btn-primary");
	playButton.innerHTML = "Play 1v1";
	const tournamentButton = document.createElement("button");
	tournamentButton.id = "tournamentButton";
	tournamentButton.classList.add("btn");
	tournamentButton.classList.add("btn-primary");
	tournamentButton.innerHTML = "Propose a tournament";
	const content = document.getElementById("content");
	content.appendChild(playButton);
	content.appendChild(tournamentButton);

	// add event listeners to the buttons
	playButton.addEventListener("click", () => {
		// remove the buttons
		playButton.remove();
		tournamentButton.remove();
		// add inputs for the 2 player names
		const player1 = document.createElement("input");
		player1.id = "player1";
		player1.placeholder = "Player 1";
		const player2 = document.createElement("input");
		player2.id = "player2";
		player2.placeholder = "Player 2";
		const startButton = document.createElement("button");
		startButton.id = "startButton";
		startButton.classList.add("btn");
		startButton.classList.add("btn-primary");
		startButton.innerHTML = "Start";
		content.appendChild(player1);
		content.appendChild(player2);
		content.appendChild(startButton);
		startButton.addEventListener("click", () => {
			// remove the inputs and the start button
			let alias1 = player1.value;
			let alias2 = player2.value;
			player1.remove();
			player2.remove();
			startButton.remove();
			fetchCreateMatch(alias1, alias2);
		});
	});

	tournamentButton.addEventListener("click", () => {
		// remove the buttons
		playButton.remove();
		tournamentButton.remove();
		// add inputs for the 4 player names
		const player1 = document.createElement("input");
		player1.id = "player1";
		player1.placeholder = "Player 1";
		const player2 = document.createElement("input");
		player2.id = "player2";
		player2.placeholder = "Player 2";
		const player3 = document.createElement("input");
		player3.id = "player3";
		player3.placeholder = "Player 3";
		const player4 = document.createElement("input");
		player4.id = "player4";
		player4.placeholder = "Player 4";
		const startButton = document.createElement("button");
		startButton.id = "startButton";
		startButton.classList.add("btn");
		startButton.classList.add("btn-primary");
		startButton.innerHTML = "Start";
		content.appendChild(player1);
		content.appendChild(player2);
		content.appendChild(player3);
		content.appendChild(player4);
		content.appendChild(startButton);
		startButton.addEventListener("click", () => {
			// remove the inputs and the start button
			let alias1 = player1.value;
			let alias2 = player2.value;
			let alias3 = player3.value;
			let alias4 = player4.value;
			player1.remove();
			player2.remove();
			player3.remove();
			player4.remove();
			startButton.remove();
			fetchCreateTournament(alias1, alias2, alias3, alias4);
		});
	});
}