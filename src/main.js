import  game  from "./pages/game.js";

const routes ={
    "/":{title:"game",render:()=>"welcome"},
    "/game":{title:"game",render:game}
}

//metodo per il routing: in base all' url cambia il contenuto di "content"
const router = ()=>{
    let view = routes[location.pathname];
    console.log(view)
    console.log(location.pathname)
    document.title = view.title;
    document.getElementById("content").innerHTML=view.render();
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