class PlayerFields extends HTMLElement {
	constructor() {
		super();
		this.tournament = "false";
		// div with the 2 input fields for the player names ad a radio button for the logged in user
		this.innerHTML = /*html*/`
			<div class="d-flex flex-row justify-content-center align-items-center" style="margin-top: 30px;">
				<div style="margin-right: 10px;">
					<input type="text" id="player1" style=" font-size: 15px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer;" placeholder="Player 1">
				</div>
				<div style="margin-right: 10px;">
					<input type="radio" id="player1" name="player" value="player1">
					<label for="player1">logged in as user</label>
				</div>
			</div>
			<div class="d-flex flex-row justify-content-center align-items-center"  style="margin-top: 30px;">
				<div style="margin-right: 10px;">
					<input type="text" id="player2" style=" font-size: 15px; padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 5px; cursor: pointer;" placeholder="Player 2">
				</div>
				<div style="margin-right: 10px;">
					<input type="radio" id="player2" name="player" value="player2">
					<label for="player2">logged in as user</label>
				</div>
			</div>
		`;
	}

	static get observedAttributes() {
		return ['tournament'];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		this.tournament = newValue;
		if (this.tournament == "true")
		{
			this.innerHTML = /*html*/`
			<div class="d-flex flex-row justify-content-center align-items-center"
				style="margin-top: 30px;">
				<div style="margin-right: 10px;">
					<input type="text" id="player1"  class="border-0 rounded" style=" font-size: 15px; padding: 10px 20px; background-color: #f1f1f1;  cursor: pointer;" placeholder="Player 1">
				</div>
				<div style="margin-right: 10px;">
					<input type="radio" id="player1" name="player" value="player1">
					<label for="player1">logged in as user</label>
				</div>
				<div style="margin-right: 10px;">
					<input type="text" id="player3"  class="border-0 rounded" style=" font-size: 15px; padding: 10px 20px; background-color: #f1f1f1;  cursor: pointer;" placeholder="Player 3">
				</div>
				<div style="margin-right: 10px;">
					<input type="radio" id="player3" name="player" value="player3">
					<label for="player3">logged in as user</label>
				</div>
			</div>
			<div class="d-flex flex-row justify-content-center align-items-center" style="margin-top: 30px;">
				<div style="margin-right: 10px;">
					<input type="text" id="player2" class="border-0 rounded"  style="font-size: 15px; padding: 10px 20px; background-color: #f1f1f1;  cursor: pointer;" placeholder="Player 2">
				</div>
				<div style="margin-right: 10px;">
					<input type="radio" id="player2" name="player" value="player2">
					<label for="player2">logged in as user</label>
				</div>
				<div style="margin-right: 10px;">
					<input type="text" id="player4"  class="border-0 rounded" style=" font-size: 15px; padding: 10px 20px; background-color: #f1f1f1;  cursor: pointer;" placeholder="Player 4">
				</div>
				<div style="margin-right: 10px;">
					<input type="radio" id="player4" name="player" value="player4">
					<label for="player4">logged in as user</label>
				</div>
			</div>
			`;
		}
	}

	get player1() {
		return this.querySelector("#player1").value.trim();
	}

	get player2() {
		return this.querySelector("#player2").value.trim();
	}

	get player3() {
		return this.querySelector("#player3").value.trim();
	}

	get player4() {
		return this.querySelector("#player4").value.trim();
	}

	// get the player names
	getPlayers() {
		const players = [];
		const inputs = this.querySelectorAll("input[type='text']");
		try{
			const creator_id = "#" + this.querySelector("input[type='radio']:checked").value;
			const creator = this.querySelector(creator_id).value;
			players.push(creator);
			for (let input of inputs) {
				if (input.value != creator)
				players.push(input.value);
			}
		}catch{}
		// const unique = new Set(players)
		// if( unique.size !== players.length){
		// 	console.log("cippalippa")
		// 	return
		// }
		return players;
	}

	get loggedUser() {
		const radios = this.querySelectorAll("input[type='radio']");
		for (let radio of radios) {
			if (radio.checked) {
				return radio.value;
			}
		}
	}

	get isloggedUser() {
		const radios = this.querySelectorAll("input[type='radio']");
		for (let radio of radios) {
			if (radio.checked) {
				return true;
			}
		}
		return false;
	}

	// check if the player fields are filled and the logged user is selected
	isFilled() {
		if (this.player1 && this.player2 && this.isloggedUser) {
			if (this.tournament == "true") {
				if (this.player3 && this.player4) {
					return true;
				}
			} else {
				return true;
			}
		}
		return false;
	}
}

customElements.define("players-fields", PlayerFields);