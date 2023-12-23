const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// Establecer fechas
const today = new Date()
const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
$("#transaction-day").valueAsDate = date
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
$("#day").valueAsDate = firstDayOfMonth

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
    return categorySelected ? categorySelected.name : ''
}
const getTransactionById = (transactionId) => getTransactions().find(({id}) => id === transactionId)

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
const editButton = (selectors, callback) => {
    selectors.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id")
            callback(id)
        })
    })
}
//Eliminar
const deleteButton = (selectors, callback) => {
    selectors.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id")
            callback(id)
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
    editButton($$(".edit-btn"), (id) => showEditCategory(id))
    deleteButton($$(".delete-btn"), (id) => deleteCategory(id))
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
const saveTransaction = (transactionId) => {
    return {
        id: transactionId ? transactionId : randomId(),
        description: $("#transaction-description").value,
        amount: $("#transaction-amount").valueAsNumber,
        type: $("#transaction-type").value,
        category: $("#transaction-categories").value,
        day: $("#transaction-day").value
    }
}
const showNewTransaction = () => {
    $("#transaction h2").innerText = "Nueva operación"
    showElement(["#transaction", "#add-transaction"])
    hideElement(["#balance-section", "#edit-transaction"])
}
const showAndHideTransacions = (transactions) => {
    if (transactions.length) {
        showElement(["#transaction-table"])
        hideElement(["#none-transaction"])
    } else {
        hideElement(["#transaction-table"])
        showElement(["#none-transaction"])
    }
}
const showEditTransaction = (id) => {
    $("#transaction h2").innerText = "Editar operación"
    showElement(["#transaction", "#edit-transaction"])
    hideElement(["#balance-section", "#add-transaction"])
    $("#edit-transaction").setAttribute("data-id", id)
    const transaction = getTransactionById(id)
    populateTransactionForm(transaction)
}
const populateTransactionForm = (transaction) => {
    $("#transaction-description").value = transaction.description
    $("#transaction-amount").value = transaction.amount
    $("#transaction-type").value = transaction.type
    $("#transaction-categories").value = transaction.category
    $("#transaction-day").value = transaction.day
}
const clearTransactionForm = () => {
    $("#transaction-description").value = ""
    $("#transaction-amount").value = "0"
    $("#transaction-type").value = "Gasto"
    $("#transaction-day").valueAsDate = date
}
const getTransactionDetails = () => {
    const description = $("#transaction-description").value
    const amount = $("#transaction-amount").valueAsNumber
    const type = $("#transaction-type").value
    const category = $("#transaction-categories").value
    const day = $("#transaction-day").value
    return { description, amount, type, category, day }
}
const addNewTransaction = () => {
    const { description, amount, type, category, day } = getTransactionDetails()

    if (description && !isNaN(amount) && type && category && day) {
        const updatedTransactions = [...getTransactions(), saveTransaction()]
        updateData(null, updatedTransactions)
        clearTransactionForm()
        handleCancel("#transaction", "#balance-section")
    } else {
        showErrorModal("Por favor completa todos los campos")
    }
}
const updateTransaction = (transactionId) => {
    const updatedTransactions = getTransactions().map(transaction =>
        (transaction.id === transactionId) ? saveTransaction(transactionId) : transaction
    )
    updateData(null, updatedTransactions)
}
const handleEditTransaction = () => {
    const transactionId = $("#edit-transaction").getAttribute("data-id")
    const { description, amount, type, category, day } = getTransactionDetails()

    if (description && !isNaN(amount) && type && category && day) {
        updateTransaction(transactionId)
        clearTransactionForm()
        handleCancel("#transaction", "#balance-section")
    } else {
        showErrorModal("Por favor completa todos los campos")
    }
}
const renderTransactionsTable = (transactions) => {
    showAndHideTransacions(transactions)
    cleanContainer("#transaction-table-body")
    for (const {id, description, amount, type, category, day} of transactions) {
        $("#transaction-table-body").innerHTML += `
            <li class="py-4 flex flex-col justify-between gap-6 md:flex-row md:justify-cente">
                <div class="flex justify-between md:w-2/5">
                    <h3 class="font-medium">${description}</h3>
                    <p class="md:w-1/2">
                        <span class="px-2 py-1 text-xs text-emerald-600 bg-emerald-50 rounded">${getCategoryNameById(category)}</span>
                    </p>
                </div>
                <div class="flex justify-between items-center md:w-3/5 md:items-start">
                    <span class="hidden md:inline-block md:w-1/3 md:text-right">${day}</span>
                    ${type === "Gasto" ? `<span class="w-7/12 text-2xl font-bold text-red-500 break-words md:w-1/4 md:text-base md:text-right">-$${amount}</span>` : `<span class="w-7/12 text-2xl font-bold text-green-500 break-words md:w-1/4 md:text-base md:text-right">+$${amount}</span>`}
                    <p class="text-xs text-indigo-700 lg:w-1/4">
                        <span class="edit-transaction-btn mr-4 cursor-pointer hover:text-zinc-700 lg:block lg:mr-0 lg:text-right" data-id="${id}">Editar</span>
                        <span class="delete-transaction-btn cursor-pointer hover:text-zinc-700 lg:block lg:text-right" data-id="${id}">Eliminar</span>
                    </p>
                </div>
            </li>`
    }
    editButton($$(".edit-transaction-btn"), (id) => showEditTransaction(id))
    deleteButton($$(".delete-transaction-btn"), (id) => deleteTransaction(id))
}
const deleteTransaction = (transactionId) => {
    const description = getTransactionById(transactionId).description
    const confirmation = confirm(`¿Estás seguro de eliminar la operación ${description}?`)

    if (confirmation) {
        const updatedTransactions = getTransactions().filter(({id}) => id !== transactionId)
        updateData(null, updatedTransactions)
    } else {
        showErrorModal("La eliminación fue cancelada")
    }
}

// BALANCE
const total = (transactionType, transactions) => {
    return transactions.filter(({type}) => transactionType === type).reduce((acc, {amount}) => acc + amount, 0)
}
const calculateBalance = (transactions) => {
    const totalIncome = total("Ganancia", transactions)
    const totalExpense = total("Gasto", transactions)
    const totalBalance = totalIncome - totalExpense

    return { totalIncome, totalExpense, totalBalance }
}
const updateBalance = (transactions) => {
    const { totalIncome, totalExpense, totalBalance } = calculateBalance(transactions)
    $("#income-amount").innerText = `+$${Math.abs(totalIncome).toFixed(2)}`
    $("#expense-amount").innerText = `-$${Math.abs(totalExpense).toFixed(2)}`
    let sign = ""
    if (totalBalance > 0) {
        $("#total-amount").classList.add("text-green-500")
        $("#total-amount").classList.remove("text-red-500")
        sign = '+'
    } else if (totalBalance < 0) {
        $("#total-amount").classList.add("text-red-500")
        $("#total-amount").classList.remove("text-green-500")
        sign = '-'
    } else {
        $("#total-amount").classList.remove("text-red-500", "text-green-500")
    }
    $("#total-amount").innerText = `${sign}$${Math.abs(totalBalance).toFixed(2)}`
}

// FILTROS
const typeFilter = (transactions, transactionType) => transactions.filter(({ type }) => type === transactionType)
const categoryFilter = (transactions, transactionCategory) => transactions.filter(({ category }) => category === transactionCategory)
const dateFilter = (transactions, transactionDate) => transactions.filter(({ day }) => new Date(day).getTime() >= transactionDate.getTime())

const orderByDate = (transactions, order) => {
    return [...transactions].sort((a, b) => {
        const dateA = new Date(a.day).getTime()
        const dateB = new Date(b.day).getTime()
        return order === 'recent' ? dateB - dateA : dateA - dateB
    })
}

const orderByAmount = (transactions, order) => {
    return [...transactions].sort((a, b) => {
        return order === 'max' ? b.amount - a.amount : a.amount - b.amount
    })
}

const orderByAlphabetically = (transactions, order) => {
    return [...transactions].sort((a, b) => {
        const descriptionA = a.description.toLowerCase()
        const descriptionB = b.description.toLowerCase()
        return order === 'aZ' ? descriptionA.localeCompare(descriptionB) : descriptionB.localeCompare(descriptionA)
    })
}

const filters = () => {
    const type = $("#type").value
    const category = $("#categories-options").value
    const day = new Date($("#day").value)
    const selectedOption = $("#order").value
    let transactions = getTransactions()
    
    if (type != "Todos")
        transactions = typeFilter(transactions, type)
    if (category != "")
        transactions = categoryFilter(transactions, category)
    transactions = dateFilter(transactions, day)

    switch (selectedOption) {
        case 'recent':
            transactions = orderByDate(transactions, selectedOption)
            break
        case 'older':
            transactions = orderByDate(transactions, selectedOption)
            break
        case 'max':
            transactions = orderByAmount(transactions, selectedOption)
            break
        case 'min':
            transactions = orderByAmount(transactions, selectedOption)
            break
        case 'aZ':
            transactions = orderByAlphabetically(transactions, selectedOption)
            break
        case 'zA':
            transactions = orderByAlphabetically(transactions, selectedOption)
            break
    }

    renderTransactionsTable(transactions)
    updateBalance(transactions)
}


const initializeProject = () => {
    initialize()
    $("#open-menu").addEventListener("click", openMenu)
    $("#close-menu").addEventListener("click", closeMenu)
    $("#hide-filters").addEventListener("click",showFilters)
    $("#show-filters").addEventListener("click",hideFilters)
    menuItems()
    // editButton()
    updateCategories(getCategories())
    $("#edit-category-button").addEventListener("click", handleEditCategory)
    $("#close-error-modal").addEventListener("click", () => hideElement(["#error-modal"]))
    $("#edit-category-cancel-button").addEventListener("click", () => handleCancel("#edit-category", "#categories-section"))
    $("#new-transaction").addEventListener("click", showNewTransaction)
    $("#add-transaction").addEventListener("click", addNewTransaction)
    $("#transaction-cancel-button").addEventListener("click", () => handleCancel("#transaction", "#balance-section"))
    $("#add-category").addEventListener("click", addNewCategory)
    updateBalance(getTransactions())
    renderTransactionsTable(getTransactions())
    $("#edit-transaction").addEventListener("click", handleEditTransaction)
    $("#type").addEventListener("change", filters)
    $("#categories-options").addEventListener("change", filters)
    $("#day").addEventListener("change", filters)
    $("#order").addEventListener("change", filters)
    filters()
}

window.addEventListener("load", initializeProject)