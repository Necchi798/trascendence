class SidebarElement extends HTMLElement {
	constructor() {
		super();
		this.txt = "";
		this.innerHTML = /*html*/`
		<button class="nav-item btn btn-toggle d-inline-flex align-items-center rounded border-0" data-bs-target="#Game-collapse" data-bs-toggle="collapse" aria-expanded="false" style="color:red">
			Game
		</button>
		<div class="collapse show" id="Game-collapse" style="padding-left: 1rem;">
		<div style="display: flex;flex-direction: column;">
				<a data-link href="/Game" class="p-2 d-inline-flex text-decoration-none" style="color:red">
					Play
				</a>
				<a class="p-2 d-inline-flex text-decoration-none" style="color:red">
					Stats
				</a>
				<a class="p-2 d-inline-flex text-decoration-none" style="color:red">
					Stats
				</a>
			</div> 
		</div>
		`;
	}
	
	static get observedAttributes() {
		return ['txt'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.txt = newValue;
		var tmp = (this.txt).toLowerCase().split(" ").join("");
		var action = tmp + "-collapse";
		this.innerHTML = /*html*/`
		<button class="nav-item btn btn-toggle d-inline-flex align-items-center rounded border-0" data-bs-target="#${action}" data-bs-toggle="collapse" aria-expanded="false" style="color:white">
			${this.txt}
		</button>
		<div class="collapse show" id="${action}" style="padding-left: 1rem;">
		<div style="display: flex;flex-direction: column;">
				<a data-link href="/${tmp}" class="p-2 d-inline-flex text-decoration-none" style="color:white">
					Play
				</a>
			</div> 
		</div>
		`;
	}

}


customElements.define("sidebar-li", SidebarElement);