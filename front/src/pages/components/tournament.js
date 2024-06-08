class Tournament extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="container">
            <div class="d-flex">
                <div class="d-flex"style=" flex-direction:column; gap:1rem">
                    <input type="text" id="player1" placeholder="Enter player 1">
                    <input type="text" id="player2" placeholder="Enter player 2">
                    <input type="text" id="player3" placeholder="Enter player 3">
                    <input type="text" id="player4" placeholder="Enter player 4">
                </div>
                <button class="btn btn-primary" id="createTorneo">crea</button>
            </div>
        </div>
        `
        document.getElementById("createTorneo").addEventListener('click',this.createTournament)
    }
    createTournament = ()=>{
		const p1 = document.getElementById("player1").value;
        const p2 = document.getElementById("player2").value;
        const p3 = document.getElementById("player3").value;
        const p4 = document.getElementById("player4").value;
        const data = [p1,p2,p3,p4];
        fetch('https://127.0.0.1:9001/create-challenge/', { //sostituire con l'indirizzo del server impostato dal backend
            method: 'POST',
            mode:"cors",
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
            },
            body: JSON.stringify(data)	// Converte l'oggetto JavaScript in una stringa JSON
	    }).then(res=>console.log(res.body))
	}
}

customElements.define("tournament-card", Tournament);