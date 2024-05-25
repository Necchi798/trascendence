import "./components/profile_card.js"
import "./components/sidebar.js"

export default  ()=> `
    <div style="display: flex;flex-direction: row;">
        <side-bar>Trascendence</side-bar>
        <main id="content" style="width: 100%;height: 100vh;">
            <div style="width: 100%; height: 100% ;display:flex; flex-direction: column;flex-wrap: wrap;align-content: center;
                    justify-content: space-around;">
                <profile-card><profile-card>
            </div>
        </main>
    </div>
`;

