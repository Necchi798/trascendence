import game from "./pages/game.js";
import home from "./pages/home.js";
import stats from "./pages/stats.js"
import { makeGame } from "./2Dpong/game.js";
import login, {loginStyle} from "./pages/login.js";
import register from "./pages/register.js";
import { actionRegister } from "./pages/register.js";
import { actionLogin } from "./pages/login.js";


const routes = {
    "/":{title:"home", render: home,action: ()=>{}},
    "/profile":{title:"profile",render: ()=>{},action: ()=>{}},
    "/2dpong":{title:"game", render: game,action:makeGame},
    "/3dpong_stats":{title: "history",render:stats,action: ()=>{}},
    "/login":{title:"login",render:login,action:actionLogin},
    "/register":{title:"register",render:register,action:actionRegister}
}

//metodo per il routing: in base all' url cambia il contenuto di "content"
const router = ()=> {
    let view = routes[location.pathname];
    if(localStorage.getItem("jwtToken") == null)
        view = routes["/login"]
    document.title = view.title;
    if (view.title === "login") {
        document.head.appendChild(loginStyle());
    }
    document.getElementById("content").innerHTML=view.render();
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
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
