import "./components/sidebar.js"

function removeFriend(username) {
	//send a POST request to the server to add the user as a friend
	fetch("https://127.0.0.1:8000/friend/", {
		method: "DELETE",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({friend: username})
	})
	.then(response => {
		if(response.ok) {
			console.log("Friend removed successfully");
			//change the button text to "Add friend"
			let btn = document.getElementById("result-" + username).querySelector("button");
			btn.innerHTML = "Add friend";
			btn.removeEventListener("click", removeFriend);
			btn.addEventListener("click", () => {
				addFriend(username);
			});
		}
		else {
			console.log("Failed to add friend");
		}
	});
}

function addFriend(username) {
	//send a POST request to the server to add the user as a friend
	fetch("https://127.0.0.1:8000/friend/", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({friend: username})
	})
	.then(response => {
		if(response.ok) {
			console.log("Friend added successfully");
			//change the button text to "Remove friend"
			let btn = document.getElementById("result-" + username).querySelector("button");
			btn.innerHTML = "Remove friend";
			btn.removeEventListener("click", addFriend);
			btn.addEventListener("click", () => {
				removeFriend(username);
			});
		}
		else {
			console.log("Failed to add friend");
		}
	});
}

function createHistoryElement(user, history) {
	const resultElement = document.createElement("div");
	resultElement.style.width = "100%";
	resultElement.style.overflow = "auto";
	resultElement.style.maxHeight = "200px";
	//for each element in the history array, create a table row and append it to the table
	const table = document.createElement("table");
	table.classList.add("table");
	const tableHead = document.createElement("thead");
	const tableHeadRow = document.createElement("tr");
	tableHeadRow.innerHTML = `
		<th scope="col">Date</th>
		<th scope="col">Opponent</th>
		<th scope="col">Result</th>
	`
	tableHead.appendChild(tableHeadRow);
	table.appendChild(tableHead);
	const tableBody = document.createElement("tbody");
	table.appendChild(tableBody);
	history.forEach(element => {
		const tableRow = document.createElement("tr");
		const date = new Date(element.ended_at)
		const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

		// Utilizza Intl.DateTimeFormat per formattare la data
		const formattedDate = new Intl.DateTimeFormat('it-IT', options).format(date);
		tableRow.innerHTML = `
			<td>${formattedDate}</td>
			<td>${element.player1 === user.username ? element.player2 : element.player1}</td>
			<td>${element.winner === user.id ? "win" : "loss"}</td>
		`
		tableBody.appendChild(tableRow);
	});
	resultElement.appendChild(table);
	return resultElement;
}

function createResultElement(user) {
	const resultElement = document.createElement("div");
	resultElement.id = "result-" + user.username;
	resultElement.classList.add("card");
	resultElement.style.width = "width: 100%";
	resultElement.innerHTML = `
		<div class="card-body" style="width: 100%;  display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
			<h5 class="card-title">${user.username}</h5>
			<div style="display: flex; flex-direction: row; align-items: center;">
				<button type="button" class="btn btn-primary"></button>
				<a href="#history-${user.id}" class="btn" data-bs-toggle="collapse">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
					</svg>
				</a>
			</div>
		</div>
		<div class="collapse" id="history-${user.id}"></div>
	`;
	//add event listener to the button to add the user as a friend
	if (user.is_friend) {
		resultElement.querySelector("button").addEventListener("click", () => {
			removeFriend(user.username);
		});
		resultElement.querySelector("button").innerHTML = "Remove friend";
	}
	else {
		resultElement.querySelector("button").addEventListener("click", () => {
			addFriend(user.username);
		});
		resultElement.querySelector("button").innerHTML = "Add friend";
	}
	// if a is clicked, fetch the user's history
	resultElement.querySelector("a").addEventListener("click", async () => {
		// if the history is already present, do not fetch it again
		if (document.getElementById("history-" + user.id).innerHTML !== "") {
			return;
		}
		console.log("Fetching user history");
		const response = await fetch("https://127.0.0.1:9001/get-user-history/", {
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({username: user.username})
		});
		const data = await response.json();
		console.log(data);
		//append each result to the results div
		const historyDiv = document.getElementById("history-" + user.id);
		const history = data.history;
		const historyElement = createHistoryElement(user, history);
		historyDiv.appendChild(historyElement);
	});

	return resultElement;
}

export default  ()=> `
	<div style="display: flex;flex-direction: row;">
		<side-bar></side-bar>
		<div style="width: 100%; height: 100% ;display:flex; flex-direction: column;flex-wrap: wrap;align-content: center">
		<main id="content" style="width: 100%;height: 100vh;overflow:hidden">
			<div class="input-group" style="padding: 3%">
				<input type="text" class="form-control" placeholder="Search..." aria-label="Search..." aria-describedby="basic-addon1" id="searchBar">
				<button class="btn btn-primary input-group-text" type="button" id="searchButton">
					Search
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
						<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
					</svg>
				</button>
			</div>
			<div id="results" style="padding: 3%">
				<p>Results will appear here</p>
			</div>
		</main>
	</div>
`;

async function searchUsers(search) {
	try {
		const response = await fetch("https://127.0.0.1:8000/users/?usr=" + search, {
			method: "GET",
			mode: "cors",
			credentials: "include"
		});
		if (response.ok) {
			const data = await response.json();
			const results = document.getElementById("results");
			results.innerHTML = "";
			data.forEach(user => {
				results.appendChild(createResultElement(user));
			});
		} else {
			console.log("Failed to fetch users");
		}
	} catch (error) {
		console.log("An error occurred while fetching users:", error);
	}
}

export function actionSearch() {
	document.getElementById("searchButton").addEventListener("click", () => {
		// change the history to add the query params using replaceState
		const search = document.getElementById("searchBar").value;
		// remove the text inside the search bar
		document.getElementById("searchBar").value = "";
		window.location.search = new URLSearchParams({usr: search});
	});
	const search = new URLSearchParams(window.location.search).get("usr");
	// if no search query is provided, display an alert
	if (search === null) {
		console.log("No search query provided");
		return;
	}
	searchUsers(search);
}