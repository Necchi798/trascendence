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
				addFriend(user.username);
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
				removeFriend(user.username);
			});
		}
		else {
			console.log("Failed to add friend");
		}
	});
}

function createResultElement(user) {
	const resultElement = document.createElement("div");
	resultElement.id = "result-" + user.username;
	resultElement.classList.add("card");
	resultElement.style.width = "18rem";
	resultElement.innerHTML = `
		<div class="card-body">
			<button type="button" class="btn btn-primary"></button>
			<h5 class="card-title">${user.username}</h5>
			<p class="card-text">${user.email}</p>
		</div>
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
			<div id="results">
				<p>Results will appear here</p>
			</div>
		</main>
	</div>
`;

export function actionSearch() {
	document.getElementById("searchButton").addEventListener("click", async () => {
		const search = document.getElementById("searchBar").value;
		//send a GET request to the server using the search query
		const response = await fetch("https://127.0.0.1:8000/users/?" + new URLSearchParams({usr: search}), {
			method: "GET",
			mode: "cors",
			credentials: "include"
		});
		const data = await response.json();
		console.log(data);
		//clear the results div
		const results = document.getElementById("results");
		results.innerHTML = "";
		//append each result to the results div
		data.forEach(user => {
			results.appendChild(createResultElement(user));
		});
	})
}