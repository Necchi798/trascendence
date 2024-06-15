function getCookieValue(cookieName) {
    // Dividi la stringa dei cookie in cookie individuali
    var cookies = document.cookie.split("; ");
    
    // Cerca il cookie desiderato utilizzando Array.find()
    var cookie = cookies.find(function(cookie) {
        // Dividi il cookie in nome e valore
        var parts = cookie.split("=");
        var cookieNameTrimmed = parts[0].trim();
        // Restituisci il cookie se il nome corrisponde a quello cercato
        return cookieNameTrimmed === cookieName;
    });
    
    // Se il cookie è stato trovato, restituisci il suo valore, altrimenti restituisci null
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}
class ProfileCard extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = /*html*/`
        <div id="123" class="card shadow" style=" display: flex;flex-direction: row;">
            <img style="width:200px;height:200px" id="image-container"></img>
            <div class="card-body ">
                <h5 class="card-title">Profile</h5>
                <div style="display: flex; gap:5rem;margin-top:2rem">
                    <div style="display: flex;flex-direction: column;gap:1rem">
                        <span>e-Mail:</span>
                        <span >name:</span>
                    </div>
                    <div id="userInfoDiv" style="display: flex;flex-direction: column;gap:1rem">
                        <span id="email" >loading...</span>
                        <span id="name">Loading...</span>
                    </div>
                    <div id="userInfoDiv" style="display: flex;flex-direction: column;gap:1rem">
                        <span >WINS: <span id="wins">no data</span></span>
                        <span>LOSSES: <span id="losses">no data</span></span>
                    </div>
                    </div>
            </div>
        </div>
        `
        this.maufetch()
    }
    async maufetch(){
        try {
        const response = await fetch("https://127.0.0.1:8000/avatar/",{
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json', // Tipo di contenuto corretto
              },
            //body:JSON.stringify(data)
        })
        const blob = await response.blob()
        const imgURL = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = imgURL;
        img.alt = 'Immagine PNG';
        document.getElementById("image-container").src = imgURL
        }catch{}
    }
    async fetchData() {
        try {
            const response = await fetch("https://127.0.0.1:8000/user/",{
                method: "GET",
                mode: "cors",
                credentials: "include"
            });
            const data = await response.json();
            const nameSpan = this.querySelector('#name');
            if (nameSpan) {
                nameSpan.textContent = data.username;
            }
            const mailSpan = this.querySelector('#email')
            if(mailSpan)
                mailSpan.textContent= data.email;
            fetch("https://127.0.0.1:9001/get-history/",{
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json', // Tipo di contenuto corretto
                  },
            }).then(async res=>await res.json()).then(res=>{
                console.log(res.data)
                const wins = res.data.filter(el=>el.winner === data.username).length
                document.getElementById("wins").innerText= wins
                document.getElementById("losses").innerText= res.data.length - wins
                console.log("qui",wins)
                console.log(res.data.length - wins)
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

customElements.define("profile-card", ProfileCard);