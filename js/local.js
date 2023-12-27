const getData = (key) => JSON.parse(localStorage.getItem(key))

const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const getCategories = () => getData("data").categories || []

const getTransactions = () => getData("data").transactions || []

const updateData = (updatedCategories, updatedTransactions) => {
    const updatedData = { 
        categories: updatedCategories || getCategories(), 
        transactions :updatedTransactions || getTransactions()
    }
    setData("data", updatedData)
    updateCategories(updatedData.categories)
    updateBalance(updatedData.transactions)
    renderTransactionsTable(updatedData.transactions)
    filters()
    updateReports()
}

const data = {
    categories : [
        { id: randomId(), name: "Comida" },
        { id: randomId(), name: "Servicios" },
        { id: randomId(), name: "Salidas" },
        { id: randomId(), name: "Educación" },
        { id: randomId(), name: "Transporte" },
        { id: randomId(), name: "Trabajo" }
    ],
    transactions : []
}

const storedData = getData("data")

const initialize = () => {
    if (!storedData)
        setData("data", data)
}