class ProfileCard extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div class="card" style=" width: 40rem;display: flex;flex-direction: row;">
                <image src="./assets/inani.svg"></image>
                <div class="card-body">
                    <h5 class="card-title">Profile</h5>
                    <div style="display: flex; gap:5rem;margin-top:2rem">
                        <div style="display: flex;flex-direction: column;gap:1rem">
                            <span>e-Mail</span>
                            <span >name:</span>
                            <span>nick-name</span>
                        </div>
                        <div style="display: flex;flex-direction: column;gap:1rem">
                            <span id="email" >loading...</span>
                            <span id="name">Loading...</span>
                            <span id="nick-name">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        `
        this.fetchData()
    }
    async fetchData() {
        try {
            const response = await fetch("https://swapi.dev/api/people/2");
            const data = await response.json();
            const nameSpan = this.querySelector('#name');
            if (nameSpan) 
                nameSpan.textContent = data.name;
            const mailSpan = this.querySelector('#email')
            if(mailSpan)
                mailSpan.textContent= data.height
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

customElements.define("profile-card",ProfileCard);