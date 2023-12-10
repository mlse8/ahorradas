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

// Filtros
const showFilters = () =>{
    hideElement("#hide-filters")
    showElement("#show-filters")
    hideElement("#filters")
}
const hideFilters = () =>{
    showElement("#hide-filters")
    hideElement("#show-filters")
    showElement("#filters")
}

const initializeProject = () => {
    $("#open-menu").addEventListener("click", openMenu)
    $("#close-menu").addEventListener("click", closeMenu)
    $("#hide-filters").addEventListener("click",showFilters)
    $("#show-filters").addEventListener("click",hideFilters)
}

window.addEventListener("load", initializeProject)