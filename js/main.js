const $ = (selector) => document.querySelector(selector)

const hideElement = (selector) => $(selector).classList.add("hidden")
const showElement = (selector) => $(selector).classList.remove("hidden")

// Menu 
const openMenu = () => {
    hideElement("#open-menu") 
    showElement("#close-menu")
    showElement("#menu")
    $("main").classList.add("translate-y-32")
}
const closeMenu = () =>{
    showElement("#open-menu")
    hideElement("#close-menu") 
    hideElement("#menu")
    $("main").classList.remove("translate-y-32")
}

const initializeProject = () => {
    $("#open-menu").addEventListener("click", openMenu)
    $("#close-menu").addEventListener("click", closeMenu)
}

window.addEventListener("load", initializeProject)