
import "./components/sidebar.js"

export default  ()=> `
    <div style="display: flex;flex-direction: row;">
        <side-bar>Trascendence</side-bar>
        <main id="content" style="width: 100%;height: 100vh;">
            <canvas style="width:100%; height:100vh"  id="canvas"></canvas>
        </main>
        <script src="../../2Dpong/game.js"></script>
    </div>
`;