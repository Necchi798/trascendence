class MatchElement extends HTMLElement
{
	constructor()
	{
		super();
		// make a div with the list groups for the tournament
		this.innerHTML = /*html*/`
			<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
				<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
					<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
						<div style="margin: 10px">
							<ul class="list-group" style="justify-content: center; align-items: center;">
								<li id="liplayer1s" class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 25px; padding: 10px 20px; border: none; border-radius: 5px; background-color: #FFF0C2">Player 1</li>
								<li class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 20px; padding: 10px 20px; border: none; border-radius: 5px;">vs</li>
								<li id="liplayer2s" class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 25px; padding: 10px 20px; border: none; border-radius: 5px; background-color: #FFF0C2">Player 2</li>
							</ul>
						</div>
					</div>
					<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
						<button id="startSingleMatchButton" style="font-family: 'Silkscreen', sans-serif; font-size: 20px; margin-top: 30px; margin-left: 5px; padding: 10px 20px; background-color: #C1EBC5; border: none; border-radius: 5px; cursor: pointer;">Start Match: Player 1 vs Player 2</button>
					</div>
				</div>
			</div>
		`;
	}
	setPlayers(players)
	{
		// set the player names in the list groups
		console.log("players: ", players);
		document.getElementById("liplayer1s").textContent = players[0];
		document.getElementById("liplayer2s").textContent = players[1];
	}
}

customElements.define("match-element", MatchElement);