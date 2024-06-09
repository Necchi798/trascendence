import { makeGame } from "../2Dpong/game.js";
import "./components/profile_card.js"
import "./components/sidebar.js"

function getCookieValue(cookieName) {
	// Dividi la stringa dei cookie in cookie individuali
	var cookies = document.cookie.split("; ");
	
	// Cerca il cookie desiderato utilizzando Array.find()
	var cookie = cookies.find(function(cookie) {
		// Dividi il cookie in nome e valore
		var parts = cookie.split("=");
		var cookieNameTrimmed = parts[0].trim();
		// Restituisci il cookie se il nome corrisponde a quello cercato
		return cookieNameTrimmed === cookieName;
	});
	
	// Se il cookie è stato trovato, restituisci il suo valore, altrimenti restituisci null
	return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

import "./components/profile_card.js"
import "./components/sidebar.js"
import "./components/friends_card.js"
import "./components/history_card.js"

export default  ()=> `
	<div style="display: flex;flex-direction: row;">
		<side-bar>Trascendence</side-bar>
		<main id="content" style="width: 100%;height: 100vh;display:flex; flex-direction: row">
            <div style="display:flex; flex-direction: column;align-content: center;
                    width: 60%; padding: 3%; gap: 5%">
				<profile-card></profile-card>
                <history-card></history-card>
            </div>
            <div style="display:flex; flex-direction: column;align-content: center;
                    width: 40%; padding: 3%; padding-left: 0%">
				<friends-card></friends-card>
            </div>
        </main>
	</div>
`;