//import  game1  from "./game";

let game1 = ()=> `<p>game</p>`;
const routes ={
    "/game":{title:"game",render:game1},
}

const router = ()=>{
    let view = routes[location.pathname];
    console.log(view)
    console.log(location.pathname)
    document.title = view.title;
    document.getElementById("content").innerHTML=view.render();
}

window.addEventListener("click",e =>{
    if(e.target.matches("[data-link]")){
        e.preventDefault();
        history.pushState("", "", e.target.href);
        router();
    }
})

window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
