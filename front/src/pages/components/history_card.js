class HistoryCard extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="card" style="width: 100%; display: flex;flex-direction: row; flex-wrap: wrap">
            <div class="card-body">
                <h5 class="card-title">History</h5>
                <div style="display: flex;margin-top:1rem ;flex-direction: column; flex-wrap: wrap">
                    <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Opponent</th>
                        <th scope="col">Result</th>
                        </tr>
                    </thead>
                    <tbody id="table">
                    </tbody>
                </div>
            </div>
        </div>
        `
        this.istory()
        //document.addEventListener('DOMContentLoaded',this.istory())
    }
    istory = ()=>{
        fetch('https://127.0.0.1:9001/get-history/', { //sostituire con l'indirizzo del server impostato dal backend
        method: 'POST',
        mode:"cors",
        credentials: 'include', 
        headers: {
        'Content-Type': 'application/json' // Specifica il tipo di contenuto
        },
        body: JSON.stringify({id:localStorage.getItem("userID")})
        }).then(async res=>await res.json()).then(res=>{
            const table = document.getElementById("table")
            res.data.forEach(element => {
               const user = localStorage.getItem("user")
               const tableRow =  document.createElement('tr');
               const date = new Date(element.ended_at)
               const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    
               // Utilizza Intl.DateTimeFormat per formattare la data
               const formattedDate = new Intl.DateTimeFormat('it-IT', options).format(date);
           
               tableRow.innerHTML =  `
                       <td>${formattedDate}</td>
                       <td>${element.player1 === user ? element.player2 : element.player1}</td>
                       <td>${element.winner === localStorage.getItem("user") ? "win" : "loss"}</td>   
               `
                table.appendChild(tableRow)
           });
        })
    }
}

customElements.define("history-card", HistoryCard);