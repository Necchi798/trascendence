function createFriendElement(friend) {
	const friendElement = document.createElement("div");
	friendElement.id = "friend-" + friend.id;
	friendElement.style = "display: flex; justify-content: space-between; flex-direction: row;";
	friendElement.classList.add("card");
	friendElement.innerHTML = `
		<div class="card-body" style="display: flex; align-items: center; justify-content: space-between; flex-direction: col;">
			<div>
				<h5>${friend.username}</h5>
			</div>
			<button class ="btn">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash" viewBox="0 0 16 16">
					<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
					<path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
				</svg>
			</button>
		</div>
	`;
	console.log(friendElement);
	return friendElement;
}

class FriendsCard extends HTMLElement {
	constructor(){
		super();
		this.innerHTML = /*html*/`
		<div class="card" id="friendsDiv" style="display: flex; flex-direction: column;">
			<div class="top" style="display: flex; align-items: center; justify-content: space-between;">
				<input type="text" id="search-input" placeholder="Search for friends...">
				<button class="btn" id="search-button"">Search</button>
			</div>
			<div class ="scroll-container" style="flex: 1; overflow-y: auto; height: 100%;">
				<div class="container" id="friendsContainer">
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

			const friendsDiv = document.getElementById("friendsDiv");
			data.forEach(friend => {
				friendsDiv.appendChild(createFriendElement(friend));
			});
			enableFriendCard();
		}
		catch(error) {
			console.error(error);
		}
	}
}

function toggleFriendShip(event) {
	const button = event.target;
	if(button.innerHTML === "Add friend")
		button.innerHTML = "Remove friend";
	else
		button.innerHTML = "Add friend";
}

function enableFriendCard() {
	const addFriend = document.querySelectorAll('.add_friend');
	addFriend.forEach((button) => {
		button.addEventListener("click", toggleFriendShip);
	});
	const searchInput = document.getElementById('search-input');
	const searchButton = document.getElementById('search-button');
	const users = document.querySelectorAll('.user');
	const searchFriends = () => {
		const searchText = searchInput.value.toLowerCase();
		users.forEach(user => {
			const userName = user.querySelector('.name h3').innerText.toLowerCase();
			if (userName.includes(searchText)) {
				user.style.display = 'flex'; // Mostra l'utente
			} else {
				user.style.display = 'none'; // Nasconde l'utente
			}
		});
	};
	searchButton.addEventListener('click', searchFriends);
	searchInput.addEventListener('input', searchFriends);
}

customElements.define("friends-card", FriendsCard);