import "./components/sidebar.js"

export default ()=>`
<div style="display: flex;flex-direction: row;">
    <side-bar>Trascendence</side-bar>
    <main id="content" style="width: 100%;height: 100vh;display:flex">
        <ul class="list-group" >
            <li class="list-group-item">An item</li>
            <li class="list-group-item">A second item</li>
            <li class="list-group-item">A third item</li>
            <li class="list-group-item">A fourth item</li>
            <li class="list-group-item">And a fifth one</li>
        </ul>
    </main>
</div>
`