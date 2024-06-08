import "./components/tournament.js"


export default  ()=> `
    <div style="display: flex;flex-direction: row;">
        <side-bar></side-bar>
        <div style ="width:100%;height:100%">
        <tournament-card></tournament-card>
        </div>
    </div>
`;