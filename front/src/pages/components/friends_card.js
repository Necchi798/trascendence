function createFriendElement(friend) {
	const friendElement = document.createElement("div");
	friendElement.id = "friend-" + friend.username;
	friendElement.style = "display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;";
	friendElement.classList.add("user");
	friendElement.innerHTML = `
	<div class="profile" style="display: flex; align-items: center; justify-content: center; gap: 10px;">
		<div class="name">
			<h5>${friend.username}</h5>
		</div>
	</div>
	<button class ="btn add_friend" style = "background-color: #e0e0e0; color: #00224D; border: 1px solid #00224D; font-size: 12px; outline: none; padding: 4px 13px; border-radius: 5px; cursor: pointer; transition: .2s linear;" onmouseover="this.style.backgroundColor='#00224D'; this.style.color='#e0e0e0';" onmouseout="this.style.backgroundColor='#e0e0e0'; this.style.color='#00224D';" onmouseover="this.style.backgroundColor='#00224D'; this.style.color='#e0e0e0';" onmouseout="this.style.backgroundColor='#e0e0e0'; this.style.color='#00224D';">Add friend</button>
	`;
	console.log(friendElement);
	return friendElement;
}

class FriendsCard extends HTMLElement {
	constructor(){
		super();
		this.innerHTML = /*html*/`
		<div class="container" id="friendsDiv" style="width: 500px; height: 400px; background-color: aliceblue; border-radius: 8px; overflow: hidden; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px; display: flex; flex-direction: column;">
			<div class="top" style="display: flex; align-items: center; justify-content: space-between; background-color: #fefeff; padding: 20px 25px; border-bottom: 1px solid #e0e0e0;">
				<input type="text" id="search-input" placeholder="Search for friends...">
				<button class="btn" id="search-button" style="background-color: #e0e0e0; color: #00224D; border: none; outline: none; padding: 7px 14px; border-radius: 4px; cursor: pointer; transition: .2s linear;" onmouseover="this.style.backgroundColor='#00224D'; this.style.color='#e0e0e0';" onmouseout="this.style.backgroundColor='#e0e0e0'; this.style.color='#00224D';">Search</button>
			</div>
			<div class ="scroll-container" style="flex: 1; overflow-y: auto; height: 100%;">
				<div class="users_container" style="padding: 25px">
				</div>
			</div>
		</div>
		`
		this.fetchFriends();
	}
	fetchFriends() {
		try {
			const response = fetch("https://127.0.0.1:8000/friend/",{
				method: "GET",
				mode: "cors",
				credentials: "include"
			});
			const data = response.json();
			const friendsDiv = document.getElementById("friendsDiv");
			data.forEach(friend => {
				friendsDiv.appendChild(createFriendElement(friend));
			});
			enableFriendCard();
		}
		catch (error) {
			console.error('Error fetching data:', error);
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