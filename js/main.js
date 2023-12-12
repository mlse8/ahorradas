const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const hideElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}
const showElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove("hidden")
    }
}

// Menu 
const openMenu = () => {
    hideElement(["#open-menu"]) 
    showElement(["#close-menu", "#menu"])
    $("main").classList.add("translate-y-32")
}
const closeMenu = () =>{
    showElement(["#open-menu"])
    hideElement(["#close-menu", "#menu"])
    $("main").classList.remove("translate-y-32")
}

// Items menu 
const menuItems = () => {
    $$("#menu li").forEach((menuItem) => {
        menuItem.addEventListener('click', () => {
            $$(".section-content").forEach(section => section.classList.add("hidden"))
            let sectionToShow = menuItem.getAttribute("data-section")
            $(`#${sectionToShow}-section`).classList.remove("hidden")
        })
    })
}

// Filtros
const showFilters = () =>{
    hideElement(["#hide-filters", "#filters"])
    showElement(["#show-filters"])
}
const hideFilters = () =>{
    showElement(["#hide-filters", "#filters"])
    hideElement(["#show-filters"])
}

// Filtros categorias
const renderCategoriesOptions = (categories) => {
    for (const {id, name} of categories) {
        $("#categories-options").innerHTML += `
            <option value="${id}">${name}</option>
        `
    }
}

const initializeProject = () => {
    $("#open-menu").addEventListener("click", openMenu)
    $("#close-menu").addEventListener("click", closeMenu)
    $("#hide-filters").addEventListener("click",showFilters)
    $("#show-filters").addEventListener("click",hideFilters)
    menuItems()
    initialize()
    renderCategoriesOptions(data.categories)
}

window.addEventListener("load", initializeProject)