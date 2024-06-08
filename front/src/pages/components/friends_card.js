class FriendsCard extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="card" style="width: 100%; display: flex;flex-direction: row">
            <div class="card-body">
                <h5 class="card-title">Friends</h5>
                <div style="display: flex;margin-top:1rem ;flex-direction: column">
                    <div>
                        <span>amico 1</span>
                    </div>
                    <hr></hr>
                    <div class="d-flex align-items-center">
                        <span>amico 2</span><div style="width: 10px;
                        height: 10px;
                        background-color: red;
                        border-radius: 100%;"></div>
                    </div>
                    <hr></hr>
                    <div>
                        <span>amico 3</span>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    createTournament = ()=>{
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

customElements.define("friends-card", FriendsCard);