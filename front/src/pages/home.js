import "./components/profile_card.js"
import "./components/sidebar.js"

export default  ()=> `
    <div style="display: flex;flex-direction: row;">
        <side-bar>Trascendence</side-bar>
        <main id="content" style="width: 100%;height: 100vh;">
            <div style="width: 100%; height: 100% ;display:flex; flex-direction: column;flex-wrap: wrap;align-content: center;
                    justify-content: space-around;">
                <profile-card><profile-card>
                <h2> Settings </h2>
				<form id="settings-form">
					<div class="d-flex justify-content-between">
						<label for="login42"></label>
						<button type="button" id="login42Button" class="btn btn-primary mx-2">Login 42</button>
					</div>
					<div class="d-flex justify-content-between">
						<label for="twofa"></label>
						<button type="button" id="twofaButton" class="btn btn-primary mx-2">2FA Authentication</button>
					</div>
				</form>
            </div>
        </main>
    </div>
`;

