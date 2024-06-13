import game from "./pages/game.js";
import home , { actionHome } from "./pages/home.js";
import stats from "./pages/stats.js"
import { actionGame } from "./2Dpong/game.js";
import login, { loginStyle } from "./pages/login.js";
import register from "./pages/register.js";
import twofa from "./pages/twofa.js";
import { actionRegister } from "./pages/register.js";
import { actionLogin } from "./pages/login.js";
import search, { actionSearch } from "./pages/search.js";
import { makeGame3d } from "./3Dpong/game.js";
import settings, { actionSettings } from "./pages/settings.js";
import tournamentpage from "./pages/tournamentpage.js";
import challenge, {actionChallenge} from "./pages/challenge.js";


const routes = {
    "/": { title: "home", render: home, action: actionHome},
    "/home": { title: "home", render: home, action: actionHome },
    "/profile": { title: "profile", render: () => { }, action: () => { } },
    "/2dpong": { title: "game", render: challenge, action:actionChallenge },
    "/game": { title: "game", render: game, action: actionGame },
    "/login": { title: "login", render: login, action: actionLogin },
    "/twofa": { title: "twofa", render: twofa, action: () => { } },
    "/register": { title: "register", render: register, action: actionRegister },
    "/search": { title: "search", render: search, action: actionSearch },
    "/settings": { title: "settings", render: settings, action: actionSettings },
    "/3dpong": { title: "3dpong", render: game, action: makeGame3d },
    "/3dpong_tournament": { title: "tournament", render: tournamentpage, action: () => { } }
}

/* export const router = ()=> {
    console.log("pippo")
    fetch("https://127.0.0.1:8000/user/",{
        method: "GET",
        mode: "cors",
        credentials: "include"
    }).then((res)=> {
            if(!res.ok) {
                window.history.pushState(null,null,"/login");
            }
            let view = routes[location.pathname];
            document.title = view.title;
            document.getElementById("divContent").innerHTML=view.render();
            view.action();
        }
    )
} */

//metodo per il routing: in base all' url cambia il contenuto di "content"
export const router = () => {
    console.log(window.location.pathname);
    if (!document.cookie.includes("jwt") && (window.location.pathname != "/register" && window.location.pathname != "/login" && window.location.pathname != "/twofa")) {
        window.history.pushState(null, null, "/login");
    }
    let view = routes[location.pathname];
    document.title = view.title;
    document.getElementById("divContent").innerHTML = view.render();
    view.action();
}

//blocca il comportamento di default degli  anchor tag <a><a/>
window.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        history.pushState("", "", e.target.href);
        router();
    }
})

//bho
window.addEventListener("pushstate", router);
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
