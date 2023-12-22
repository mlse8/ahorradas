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
            hideElement(["#edit-category", "#transaction"])
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

const showErrorModal = (text) =>{
    $(".error-modal-text").innerText = text
    showElement(["#error-modal"])
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
//Eliminar
const deleteButton = () => {
    $$(".delete-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const categoryId = button.getAttribute("data-id")
            deleteCategory(categoryId)
        })
    })
}
// Filtros
const renderCategoriesOptions = (categories) => {
    cleanContainer("#categories-options")
    cleanContainer("#transaction-categories")
    $("#categories-options").innerHTML = `<option value="">Todas</option>`
    for (const {id, name} of categories) {
        $("#categories-options").innerHTML += `
            <option value="${id}">${name}</option>
        `
        $("#transaction-categories").innerHTML += `
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
                    <span class="delete-btn text-xs text-indigo-700 cursor-pointer hover:text-zinc-700" data-id="${id}">Eliminar</span>
                </div>
            </div>`
    }
    editButton()
    deleteButton()
}
// Actualizar el nombre de una categoria
const updateCategoryName = (categoryId, newName) => {
    const updatedCategories = getCategories().map(category =>
        (category.id === categoryId) ? { ...category, name: newName } : category
    )
    updateData(updatedCategories, null)
}
const handleCancel = (hideSection, showSection) => {
    hideElement([hideSection])
    showElement([showSection])
}
const handleEditCategory = () => {
    const categoryId = $("#edit-category-button").getAttribute("data-id")
    const newName = $("#categories-description").value
    if (categoryId && newName) {
        updateCategoryName(categoryId, newName)
        handleCancel("#edit-category", "#categories-section")
    } else {
        showErrorModal("El nombre no puede estar vacío")
    }
}
//Eliminar una categoría
const deleteCategory = (categoryId) => {
    const categoryName = getCategoryNameById(categoryId)
    const confirmation = confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)

    if (confirmation) {
        const updatedCategories = getCategories().filter(({id}) => id !== categoryId)
        const updatedTransactions = getTransactions().filter(({category}) => category !== categoryId)
        updateData(updatedCategories, updatedTransactions)
    } else {
        showErrorModal("La eliminación fue cancelada")
    }
}
// Actualizar categorias 
const updateCategories = (categorias) => {
    renderCategoriesTable(categorias)
    renderCategoriesOptions(categorias)
}
// Función para agregar una nueva categoría
const addNewCategory = () => {
    const categoryName = $("#categories-input").value
    if (categoryName) {
        const newCategory = {
            id: randomId(),
            name: categoryName,
        }
        const updatedCategories = [...getCategories(), newCategory]
        updateData(updatedCategories, getTransactions())
        $("#categories-input").value = ""
    } else {
        showErrorModal("El nombre no puede estar vacío")
    }
}


// OPERACIONES 
const showNewTransaction = () => {
    showElement(["#transaction"])
    hideElement(["#balance-section"])
}
const addNewTransaction = () => {
    const description = $("#transaction-description").value
    const amount = parseFloat($("#transaction-amount").value)
    const type = $("#transaction-type").value
    const category = $("#transaction-categories").value
    const day = $("#transaction-day").value

    if (description && !isNaN(amount) && type && category && day) {
        const newTransaction = {
            id: randomId(),
            description,
            amount,
            type,
            category,
            day,
        }
        const updatedTransactions = [...getTransactions(), newTransaction]
        updateData(null, updatedTransactions)

        $("#transaction-description").value = ""
        $("#transaction-amount").value = "0"
        $("#transaction-type").value = "Gasto"
        $("#transaction-day").value = ""
        handleCancel("#transaction", "#balance-section")
    } else {
        showErrorModal("Por favor completa todos los campos")
    }
}


// BALANCE
const total = (transactionType) => {
    return getTransactions().filter(({type}) => transactionType === type).reduce((acc, {amount}) => acc + amount, 0)
}
const calculateBalance = () => {
    const totalIncome = total("Ganancia")
    const totalExpense = total("Gasto")
    const totalBalance = totalIncome - totalExpense

    return { totalIncome, totalExpense, totalBalance }
}
const updateBalance = () => {
    const { totalIncome, totalExpense, totalBalance } = calculateBalance()
    $("#income-amount").innerText = `+$${totalIncome.toFixed(2)}`
    $("#expense-amount").innerText = `-$${totalExpense.toFixed(2)}`
    let sign = ""
    if (totalBalance > 0) {
        $("#total-amount").classList.add("text-green-500")
        sign = '+'
    } else if (totalBalance < 0) {
        $("#total-amount").classList.add("text-red-500")
        sign = '-'
    } else {
        $("#total-amount").classList.remove("text-red-500", "text-green-500")
    }
    $("#total-amount").innerText = `${sign}$${Math.abs(totalBalance).toFixed(2)}`
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
    $("#close-error-modal").addEventListener("click", () => hideElement(["#error-modal"]))
    $("#edit-category-cancel-button").addEventListener("click", () => handleCancel("#edit-category", "#categories-section"))
    $("#new-transaction").addEventListener("click", showNewTransaction)
    $("#add-transaction").addEventListener("click", addNewTransaction)
    $("#transaction-cancel-button").addEventListener("click", () => handleCancel("#transaction", "#balance-section"))
    $("#add-category").addEventListener("click", addNewCategory)
    updateBalance()
}

window.addEventListener("load", initializeProject)