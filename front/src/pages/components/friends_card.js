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
}

customElements.define("friends-card", FriendsCard);