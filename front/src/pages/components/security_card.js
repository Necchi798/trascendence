class SecurityCard extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
		<div class="card security-card">
			<div class="card-body">
				<h5 class="card-title">Account Security</h5>
				<p>Enhance your account security with two-factor authentication.</p>
				<div class="button-container">
					<button id="access-email" class="btn btn-primary">Access via Email</button>
					<button id="access-otp" class="btn btn-secondary">Access via OTP</button>
				</div>
			</div>
		</div>
		`;
		this.addClickListeners();
	}

	addClickListeners() {
		const emailButton = this.querySelector('#access-email');
		const otpButton = this.querySelector('#access-otp');

		emailButton.addEventListener('click', () => {
			console.log('Button clicked: Accesso tramite e-Mail');
			// emailButton.classList.add('active');
			// otpButton.classList.remove('active');
		});

		otpButton.addEventListener('click', () => {
			console.log('Button clicked: Accesso tramite codice OTP');
			// otpButton.classList.add('active');
			// emailButton.classList.remove('active');
		});
	}
}

customElements.define('security-card', SecurityCard);

const style = document.createElement('style');
style.textContent = `
.security-card {
	width: 40rem;
	display: flex;
	flex-direction: column;
	margin-top: 1rem;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	background-color: #fff;
	transition: transform 0.2s;
}

.security-card:hover {
	transform: translateY(-5px);
}

.security-card .card-body {
	padding: 2rem;
}

.security-card .card-title {
	font-size: 1.5rem;
	margin-bottom: 1rem;
}

.security-card p {
	margin-bottom: 1.5rem;
	font-size: 1rem;
	color: #555;
}

.button-container {
	display: flex;
	gap: 1rem;
}

.btn {
	padding: 0.5rem 1rem;
	font-size: 1rem;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.btn-primary {
	background-color: #007bff;
	color: white;
}

.btn-primary:hover {
	background-color: #0056b3;
}

.btn-secondary {
	background-color: #6c757d;
	color: white;
}

.btn-secondary:hover {
	background-color: #5a6268;
}
`;
document.head.appendChild(style);
