import "./components/sidebar.js"

export default  ()=> `
    <div style="display: flex;flex-direction: row;">
        <side-bar></side-bar>
        <main id="content" style="width: 100%;height: 100vh;overflow:hidden">
        </main>
        <script src="../../2Dpong/game.js"></script>
    </div>
`;