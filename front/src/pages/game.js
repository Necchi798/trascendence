
import "./components/sidebar.js"

export default  ()=> `
    <div style="display: flex;flex-direction: row;">
        <side-bar>Trascendence</side-bar>
        <main id="content" style="width: 100%;height: 100vh;overflow:hidden">
            <canvas id="canvas"></canvas>
        </main>
        <script src="../../2Dpong/game.js"></script>
    </div>
`;