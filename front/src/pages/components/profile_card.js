class ProfileCard extends HTMLElement {
    constructor(){
        super();
        fetch("https://swapi.dev/api/people/2").then(res=>console.log(res))
        this.innerHTML = /*html*/`
        <div class="card" style=" width: 40rem;display: flex;flex-direction: row;">
                <image src="./assets/inani.svg"></image>
                <div class="card-body">
                    <h5 class="card-title">Profile</h5>
                    <div style="display: flex;flex-direction: column;gap:1rem">
                        <span>e-Mail</span>
                        <span>name</span>
                        <span>nick-name</span>
                    </div>
                </div>
            </div>
        `
    }
}

customElements.define("profile-card",ProfileCard)