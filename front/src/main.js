import game from "./pages/game.js";
import home from "./pages/home.js";
import stats from "./pages/stats.js"
import { makeGame } from "./2Dpong/game.js";
const routes = {
    "/":{title:"home", render: home,action: ()=>{}},
    "/profile":{title:"profile",render: ()=>{},action: ()=>{}},
    "/2dpong":{title:"game", render: game,action:makeGame},
    "/3dpong_stats":{title: "history",render:stats,action: ()=>{}}
}

//metodo per il routing: in base all' url cambia il contenuto di "content"
const router = ()=> {
    let view = routes[location.pathname];
    console.log(view)
    console.log(location.pathname)
    document.title = view.title;
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