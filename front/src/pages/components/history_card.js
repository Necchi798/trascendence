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
    }
}

customElements.define("history-card", HistoryCard);