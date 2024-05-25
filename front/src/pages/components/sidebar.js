// New component
import "./sidebar_element.js";

class Sidebar extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = /*html*/`
		<div style="display: flex;flex-direction: row;">
			<div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style="width: 280px;height: 100vh">
				<a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
					<span class="fs-4">Sidebar</span>
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
						<img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
						<strong>mdo</strong>
					</a>
					<ul class="dropdown-menu dropdown-menu-dark text-small shadow">
						<li><a data-link class="dropdown-item" href="/home">Profile</a></li>
						<li><hr class="dropdown-divider"></li>
						<li id="logout" class="dropdown-item" style="cursor: pointer;">Sign out</a></li>
					</ul>
				</div>
			</div>
		</div>
		`;
		document.getElementById("logout").addEventListener("click",()=> {localStorage.removeItem("jwtToken"),window.location="/login"})
	}
}

customElements.define("side-bar", Sidebar);
