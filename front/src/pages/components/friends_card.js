function removeFriend(username, id) {
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
			//remove the div of the friend
			let friendDiv = document.getElementById("friend-" + id);
			document.getElementById("friendsContainer").removeChild(friendDiv);
		}
		else {
			console.log("Failed to add friend");
		}
	});
}

function createFriendElement(friend) {
	const friendElement = document.createElement("div");
	friendElement.id = "friend-" + friend.id;
	friendElement.style = "display: flex; justify-content: space-between; flex-direction: col;";
	friendElement.classList.add("card");
	friendElement.innerHTML = `
		<div class="card-body d-flex flex-row align-items-center justify-content-between" >
			<div class="name d-flex align-items-center"  >
				${friend.username}
			</div>
			<button class ="btn" id="removeFriendsBtn">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash" viewBox="0 0 16 16">
					<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
					<path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
				</svg>
			</button>
		</div>
	`;
	return friendElement;
}

class FriendsCard extends HTMLElement {
	constructor(){
		super();
		this.innerHTML = /*html*/`
		<div class="card" id="friendsDiv" class="d-flex flex-column shadow" style="padding: 2rem">
			<div class="top" class="d-flex align-items-center justify-content-between">
				<a class="btn d-flex align-items-center" style="gap:1rem" id="searchButton" href="/search">
					Search new friends
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
						<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
						<path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
					</svg>
				</a>
			</div>
			<div class ="scroll-container" style="flex: 1; overflow-y: auto; height: 100%;">
				<div class="container" id="friendsContainer" >
				</div>
			</div>
		</div>
		`
		this.fetchFriends();
	}
	async fetchFriends() {
		try {
			const response = await fetch("https://127.0.0.1:8000/friend/",{
				method: "GET",
				mode: "cors",
				credentials: "include"
			});
			console.log(response);
			if (!response.ok) {
				throw new Error("Something went wrong");
			}
			const data = await response.json();
			console.log(data);

			const friendsDiv = document.getElementById("friendsContainer");
			data.forEach(friend => {
				friendsDiv.appendChild(createFriendElement(friend));
				const removeFriendsBtn = document.getElementById("friend-" + friend.id).querySelector("#removeFriendsBtn");
				removeFriendsBtn.addEventListener("click", () => {
					removeFriend(friend.username, friend.id);
				});
				//checks if the friend is online by looking at the last_fetch field is 10 minutes old
				const lastFetch = new Date(friend.last_fetch);
				const now = new Date();
				console.log(now);
				console.log(lastFetch);
				console.log(now - lastFetch);
				if (now - lastFetch < 60000) {
					const status = document.createElement("div");
					status.classList.add("status");
					status.style = "background-color: green; border-radius: 50%; width: 10px; height: 10px; margin-left: 5px";
					document.getElementById("friend-" + friend.id).querySelector(".name").appendChild(status);
				}else{
					const status = document.createElement("div");
					status.classList.add("status");
					status.style = "background-color: grey; border-radius: 50%; width: 10px; height: 10px; margin-left: 5px";
					document.getElementById("friend-" + friend.id).querySelector(".name").appendChild(status);
				}
			});
		}
		catch(error) {
			console.error(error);
		}
	}
}


customElements.define("friends-card", FriendsCard);