class TournamentElement extends HTMLElement
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
								<li id="liplayer1" class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 25px; padding: 10px 20px; border: none; border-radius: 5px; background-color: #FFF0C2">Player 1</li>
								<li class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 20px; padding: 10px 20px; border: none; border-radius: 5px;">vs</li>
								<li id="liplayer2" class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 25px; padding: 10px 20px; border: none; border-radius: 5px; background-color: #FFF0C2">Player 2</li>
							</ul>
						</div>
						<div id="secondDiv" style="margin: 10px">
							<ul class="list-group" style="justify-content: center; align-items: center;">
								<li id="liplayer3" class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 25px; padding: 10px 20px; border: none; border-radius: 5px; background-color: #FFF0C2">Player 3</li>
								<li class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 20px; padding: 10px 20px; border: none; border-radius: 5px;">vs</li>
								<li id="liplayer4" class="list-group" style="font-family: 'Silkscreen', sans-serif; font-size: 25px; padding: 10px 20px; border: none; border-radius: 5px; background-color: #FFF0C2">Player 4</li>
							</ul>
						</div>
					</div>
					<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
						<button id="startMatchButton" style="font-family: 'Silkscreen', sans-serif; font-size: 20px; margin-top: 30px; margin-left: 5px; padding: 10px 20px; background-color: #C1EBC5; border: none; border-radius: 5px; cursor: pointer;">Start Match: Player 1 vs Player 2</button>
					</div>
				</div>
			</div>
		`;
	}
	setPlayers(players)
	{
		// set the player names in the list groups
		console.log("players: ", players);
		document.getElementById("liplayer1").textContent = players[0];
		document.getElementById("liplayer2").textContent = players[1];
		document.getElementById("liplayer3").textContent = players[2];
		document.getElementById("liplayer4").textContent = players[3];
	}
}

customElements.define("tournament-element", TournamentElement);