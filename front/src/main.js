import game from "./pages/game.js";
import game3d from "./pages/game3d.js";
import home , { actionHome } from "./pages/home.js";
import stats from "./pages/stats.js"
import { actionGame } from "./2Dpong/game.js";
import login, { loginStyle } from "./pages/login.js";
import register from "./pages/register.js";
import twofa, {actionTwofa} from "./pages/twofa.js";
import { actionRegister } from "./pages/register.js";
import { actionLogin } from "./pages/login.js";
import search, { actionSearch } from "./pages/search.js";
import { actionGame3D } from "./3Dpong/game3D.js";
import settings, { actionSettings } from "./pages/settings.js";
import challenge, {actionChallenge} from "./pages/challenge.js";
import challenge3D, { actionChallenge3D } from "./pages/challenge3D.js";


const routes = {
    "/": { title: "home", render: home, action: actionHome},
    "/home": { title: "home", render: home, action: actionHome },
    "/2dpong": { title: "match", render: challenge, action: actionChallenge },
    "/3dpong": { title: "match3D", render: challenge3D, action: actionChallenge3D },
    "/game": { title: "game", render: game, action: actionGame },
    "/game3d": { title: "game3D", render: game3d, action: actionGame3D },
    "/login": { title: "login", render: login, action: actionLogin },
    "/twofa": { title: "twofa", render: twofa, action: actionTwofa },
    "/register": { title: "register", render: register, action: actionRegister },
    "/search": { title: "search", render: search, action: actionSearch },
    "/settings": { title: "settings", render: settings, action: actionSettings }
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
