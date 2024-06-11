import game from "./pages/game.js";
import home from "./pages/home.js";
import stats from "./pages/stats.js"
import { makeGame } from "./2Dpong/game.js";
import login, {loginStyle} from "./pages/login.js";
import register from "./pages/register.js";
import twofa from "./pages/twofa.js";
import { actionRegister } from "./pages/register.js";
import { actionLogin } from "./pages/login.js";
import search, { actionSearch } from "./pages/search.js";
import { makeGame3d } from "./3Dpong/game.js";
import settings, {actionSettings} from "./pages/settings.js";
import tournament from "./pages/tournamentpage.js"
import tournamentpage from "./pages/tournamentpage.js";
import { startGame } from "./2Dpong/start.js";
const routes = {
    "/":{title:"home", render: home, action: ()=>{}},
    "/home":{title:"home", render: home, action: ()=>{}},
    "/profile":{title:"profile",render: ()=>{},action: ()=>{}},
    "/2dpong":{title:"game", render: game,action:startGame},
    "/3dpong_stats":{title: "history",render:stats,action: ()=>{}},
    "/login":{title:"login",render:login,action:actionLogin},
    "/twofa":{title:"twofa",render:twofa,action:()=>{}},
    "/register":{title:"register",render:register,action:actionRegister},
    "/search":{title:"search",render:search,action:actionSearch},
    "/settings":{title:"settings",render:settings,action:actionSettings},
    "/3dpong":{title:"3dpong",render:game,action:makeGame3d},
    "/3dpong_tournament":{title:"tournament",render:tournamentpage,action:()=>{}}
}

//metodo per il routing: in base all' url cambia il contenuto di "content"
export const router = ()=> {
    console.log(window.location.pathname);
    // if(!document.cookie.includes("jwt") && window.location.pathname != "/register" && window.location.pathname != "/login" && window.location.pathname != "/twofa") {
    //     window.history.pushState(null,null,"/login");
    // }
    let view = routes[location.pathname];
    document.title = view.title;
    document.getElementById("divContent").innerHTML=view.render();
    view.action();
}

//blocca il comportamento di default degli  anchor tag <a><a/>
window.addEventListener("click",e =>{
    if(e.target.matches("[data-link]")){
        e.preventDefault();
        history.pushState("", "", e.target.href);
        router();
    }
})

//bho
window.addEventListener("pushstate", router);
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
