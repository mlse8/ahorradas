// Mostrar filtros
const showFilters = () =>{
    hideElement(["#hide-filters", "#filters"])
    showElement(["#show-filters"])
}

// Ocultar filtros
const hideFilters = () =>{
    showElement(["#hide-filters", "#filters"])
    hideElement(["#show-filters"])
}

// Filtrar por tipo
const typeFilter = (transactions, transactionType) => transactions.filter(({ type }) => type === transactionType)

// Filtrar por categoría
const categoryFilter = (transactions, transactionCategory) => transactions.filter(({ category }) => category === transactionCategory)

// Filtrar por fecha mayor o igual
const dateFilter = (transactions, transactionDate) => transactions.filter(({ day }) => new Date(day).getTime() >= transactionDate.getTime())

// Ordenar de la operación más o menos reciente
const orderByDate = (transactions, order) => {
    return [...transactions].sort((a, b) => {
        const dateA = new Date(a.day).getTime()
        const dateB = new Date(b.day).getTime()
        return order === 'recent' ? dateB - dateA : dateA - dateB
    })
}

// Ordenar del mayor o menor monto
const orderByAmount = (transactions, order) => {
    return [...transactions].sort((a, b) => {
        return order === 'max' ? b.amount - a.amount : a.amount - b.amount
    })
}

// Ordenar alfabéticamente
const orderByAlphabetically = (transactions, order) => {
    return [...transactions].sort((a, b) => {
        const descriptionA = a.description.toLowerCase()
        const descriptionB = b.description.toLowerCase()
        return order === 'aZ' ? descriptionA.localeCompare(descriptionB) : descriptionB.localeCompare(descriptionA)
    })
}

// Todos los filtros
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

const initializeFilters = () => {
    $("#hide-filters").addEventListener("click",showFilters)
    $("#show-filters").addEventListener("click",hideFilters)
    $("#type").addEventListener("change", filters)
    $("#categories-options").addEventListener("change", filters)
    $("#day").addEventListener("change", filters)
    $("#order").addEventListener("change", filters)
}