// New component
import "./sidebar_element.js";

class Sidebar extends HTMLElement {
	constructor() {
		super();
		this.id = "sidebar-component"
		this.innerHTML = /*html*/`
		<div style="display: flex;flex-direction: row;">
			<div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style="width: 280px;height: 100vh">
				<a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
					<span class="fs-4">Trascendence</span>
				</a>
				<hr>
					<ul class="nav nav-pills flex-column mb-auto">
						<li>
							<sidebar-li txt="3D Pong"></sidebar-li>
						</li>
						<li>
							<sidebar-li txt="2D Pong"></sidebar-li>
						</li>
					</ul>
				<hr>
				<div class="dropdown">
					<a href="" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
						<img id="image-container-sidebar" alt="" width="32" height="32" class="rounded-circle me-2">
						<strong id="name-sidebar"></strong>
					</a>
					<ul class="dropdown-menu dropdown-menu-dark text-small shadow">
						<li><a data-link class="dropdown-item" href="/home">Profile</a></li>
						<li><a data-link class="dropdown-item" href="/settings">Settings</a></li>
						<li><hr class="dropdown-divider"></li>
						<li id="logout" class="dropdown-item" style="cursor: pointer;">Sign out</a></li>
					</ul>
				</div>
			</div>
		</div>
		`;
		this.maufetch()
		document.getElementById("logout").addEventListener("click",()=> { document.cookie = "jwt" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';window.location="/login"})
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
		 document.getElementById("image-container-sidebar").src = imgURL
		 const res = await fetch("https://127.0.0.1:8000/user/",{
			method: "GET",
			mode: "cors",
			credentials: "include"
		});
		const userData = await res.json()
		document.getElementById("name-sidebar").innerText=userData.username

		}catch{}
	 }
}

customElements.define("side-bar", Sidebar);
