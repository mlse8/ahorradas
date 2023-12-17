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

const cleanContainer = (selector) => $(selector).innerHTML = ""

const getCategoryNameById = (categoryId) => {
    const categorySelected = getCategories().find(({id}) => id === categoryId)
    return categorySelected ? categorySelected.name : 'nada'
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
            hideElement(["#edit-category"])
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

// CATEGORIAS 
// Editar
const showEditCategory = (categoryId) => {
    showElement(["#edit-category"])
    $("#categories-description").value = getCategoryNameById(categoryId)
    $("#edit-category-button").setAttribute("data-id", categoryId)
    hideElement(["#categories-section"])
}
const editButton = () => {
    $$(".edit-btn").forEach(button => {
        button.addEventListener("click", () => {
            const categoryId = button.getAttribute("data-id")
            showEditCategory(categoryId)
        })
    })
}
// Filtros
const renderCategoriesOptions = (categories) => {
    cleanContainer("#categories-options")
    $("#categories-options").innerHTML = `<option value="">Todas</option>`
    for (const {id, name} of categories) {
        $("#categories-options").innerHTML += `
            <option value="${id}">${name}</option>
        `
    }
}
// Tabla
const renderCategoriesTable = (categories) => {
    cleanContainer("#categories-table")
    for (const {id, name} of categories) {
        $("#categories-table").innerHTML += `
            <div class="mb-6 flex justify-between items-center">
                <p class="px-3 py-1 text-xs text-emerald-600 bg-emerald-50 rounded">${name}</p>
                <div>
                    <span class="edit-btn mr-4 text-xs text-indigo-700 cursor-pointer hover:text-zinc-700" data-id="${id}">Editar</span>
                    <span class="text-xs text-indigo-700 cursor-pointer hover:text-zinc-700">Eliminar</span>
                </div>
            </div>`
    }
    editButton()
}
// Actualizar el nombre de una categoria
const updateCategoryName = (categoryId, newName) => {
    const updatedCategories = getCategories().map(category =>
        (category.id === categoryId) ? { ...category, name: newName } : category
    )
    updateData(updatedCategories)
}
const handleEditCategory = () => {
    const categoryId = $("#edit-category-button").getAttribute("data-id")
    const newName = $("#categories-description").value
    if (categoryId && newName) {
        updateCategoryName(categoryId, newName)
        hideElement(["#edit-category"])
        showElement(["#categories-section"])
        updateData()
    }
}
// Actualizar categorias 
const updateCategories = (categorias) => {
    renderCategoriesTable(categorias)
    renderCategoriesOptions(categorias)
}


const initializeProject = () => {
    initialize()
    $("#open-menu").addEventListener("click", openMenu)
    $("#close-menu").addEventListener("click", closeMenu)
    $("#hide-filters").addEventListener("click",showFilters)
    $("#show-filters").addEventListener("click",hideFilters)
    menuItems()
    editButton()
    updateCategories(getCategories())
    $("#edit-category-button").addEventListener("click", handleEditCategory)
}

window.addEventListener("load", initializeProject)