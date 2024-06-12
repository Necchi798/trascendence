import "./components/tournament.js"


export default  ()=> `
    <div style="display: flex;flex-direction: row;">
        <side-bar></side-bar>
        <main id="content" style="width: 100%;height: 100vh;display:flex">
            <div >
            <tournament-card></tournament-card>
            </div>
        </main>
    </div>
`;