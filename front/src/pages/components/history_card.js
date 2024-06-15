class HistoryCard extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="card shadow" class="d-flex w-100 flex-row flex-wrap">
    <div class="card-body" class="w-100">
        <h5 class="card-title">History</h5>
        <div class="d-flex flex-column flex-wrap mt-4 flex-wrap">
            <div style="overflow-y: auto; max-height: 200px; width: 100%;">
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
                </table>
            </div>
        </div>
    </div>
</div>

        `
    }
}

customElements.define("history-card", HistoryCard);