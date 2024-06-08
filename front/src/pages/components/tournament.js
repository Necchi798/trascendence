class Tournament extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="container">
            <div class="d-flex" style="gap:1rem">
                <div class="d-flex"style=" flex-direction:column; gap:1rem">
                    <span id="userNameForTournament"></span>
                    <input type="text" id="player2" placeholder="Enter player 2">
                    <input type="text" id="player3" placeholder="Enter player 3">
                    <input type="text" id="player4" placeholder="Enter player 4">
                </div>
                <button class="btn btn-primary" id="createTorneo" >crea</button>
                <button class="btn btn-primary" id="prossimomatch" >prossimo match</button>
            </div>
        </div>
        `
        document.getElementById("userNameForTournament").textContent=localStorage.getItem("user")
        document.getElementById("createTorneo").addEventListener('click',this.createTournament)
        document.getElementById("prossimomatch").addEventListener('click',this.prossimapartita)
    }
    createTournament = ()=>{
		const p1 = localStorage.getItem("user")
        const p2 = document.getElementById("player2").value;
        const p3 = document.getElementById("player3").value;
        const p4 = document.getElementById("player4").value;
        const data = {names: [p1,p2,p3,p4]};
        fetch('https://127.0.0.1:9001/create-challenge/', { //sostituire con l'indirizzo del server impostato dal backend
            method: 'POST',
            mode:"cors",
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
            },
            body: JSON.stringify(data)	// Converte l'oggetto JavaScript in una stringa JSON
	    }).then(async res=>await res.json()).then(res=>console.log(res))
	}
    prossimapartita = ()=>{
        fetch('https://127.0.0.1:9001/get-next-match/', { //sostituire con l'indirizzo del server impostato dal backend
        method: 'GET',
        mode:"cors",
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json' // Specifica il tipo di contenuto
        },
    }).then(async res=>await res.json()).then(res=>{
        localStorage.setItem("match_id", res.body.match_id)
        history.pushState({},"","/2dpong")
        router();
    }
    )
}
}

customElements.define("tournament-card", Tournament);