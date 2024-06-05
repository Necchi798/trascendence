class FriendsCard extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="card" style="width: 100%; display: flex;flex-direction: row">
            <div class="card-body">
                <h5 class="card-title">Friends</h5>
                <div style="display: flex;margin-top:1rem ;flex-direction: column">
                    
                </div>
            </div>
        </div>
        `
        this.fetchFriends();
    }
    async fetchFriends() {
        /* try {
            const response = await fetch("https:// */
        }
}

customElements.define("friends-card", FriendsCard);