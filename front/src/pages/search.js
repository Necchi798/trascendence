import "./components/sidebar.js"

export default  ()=> `
	<div style="display: flex;flex-direction: row;">
		<side-bar></side-bar>
		<div style="width: 100%; height: 100% ;display:flex; flex-direction: column;flex-wrap: wrap;align-content: center">
		<main id="content" style="width: 100%;height: 100vh;overflow:hidden">
			<div class="input-group" style="padding: 3%">
				<input type="text" class="form-control" placeholder="Search..." aria-label="Search..." aria-describedby="basic-addon1">
				<button class="btn btn-primary input-group-text" type="button">
					Search
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
						<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
					</svg>
				</button>
			</div>
		</main>
	</div>
`;

