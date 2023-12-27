// Obtener una operación ya almacenada
const getTransactionById = (transactionId) => getTransactions().find(({id}) => id === transactionId)

// Limpiar los inputs
const clearTransactionForm = () => {
    $("#transaction-description").value = ""
    $("#transaction-amount").value = "0"
    $("#transaction-type").value = "Gasto"
    $("#transaction-day").valueAsDate = date
}

// Mostrar pantalla para agregar una nueva operación
const showNewTransaction = () => {
    $("#transaction h2").innerText = "Nueva operación"
    clearTransactionForm()
    showElement(["#transaction", "#add-transaction"])
    hideElement(["#balance-section", "#edit-transaction"])
}

// Mostrar operaciones, si las hay
const showAndHideTransacions = (transactions) => {
    if (transactions.length) {
        showElement(["#transaction-table"])
        hideElement(["#none-transaction"])
    } else {
        hideElement(["#transaction-table"])
        showElement(["#none-transaction"])
    }
}

// Guardar una operación
const saveTransaction = (transactionId) => {
    return {
        id: transactionId ? transactionId : randomId(),
        description: $("#transaction-description").value,
        amount: $("#transaction-amount").valueAsNumber,
        type: $("#transaction-type").value,
        category: $("#transaction-categories").value,
        day: $("#transaction-day").value.replace(/-/g, '/')
    }
}

// Obtener los valores de los inputs
const getTransactionDetails = () => {
    const description = $("#transaction-description").value
    const amount = $("#transaction-amount").valueAsNumber
    const type = $("#transaction-type").value
    const category = $("#transaction-categories").value
    const day = $("#transaction-day").valueAsDate
    return { description, amount, type, category, day }
}

// Cargar los inputs con los detalles de la operación
const populateTransactionForm = (transaction) => {
    $("#transaction-description").value = transaction.description
    $("#transaction-amount").value = transaction.amount
    $("#transaction-type").value = transaction.type
    $("#transaction-categories").value = transaction.category
    $("#transaction-day").valueAsDate = new Date (transaction.day)
}

// Agregar una nueva operación
const addNewTransaction = () => {
    const { description, amount, type, category, day } = getTransactionDetails()

    if (description && !isNaN(amount) && type && category && day) {
        const updatedTransactions = [...getTransactions(), saveTransaction()]
        updateData(null, updatedTransactions)
        handleCancel("#transaction", "#balance-section")
    } else {
        showErrorModal("Por favor completa todos los campos")
    }
}

// Mostrar pantalla para editar una operación
const showEditTransaction = (id) => {
    $("#transaction h2").innerText = "Editar operación"
    showElement(["#transaction", "#edit-transaction"])
    hideElement(["#balance-section", "#add-transaction"])
    $("#edit-transaction").setAttribute("data-id", id)
    const transaction = getTransactionById(id)
    populateTransactionForm(transaction)
}

// Actualizar una operación
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
        handleCancel("#transaction", "#balance-section")
    } else {
        showErrorModal("Por favor completa todos los campos")
    }
}

// Eliminar una operación
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

// Cargar tabla 
const renderTransactionsTable = (transactions) => {
    showAndHideTransacions(transactions)
    cleanContainer("#transaction-table-body")
    for (const {id, description, amount, type, category, day} of transactions) {
        const transactionDate = new Date(day)
        $("#transaction-table-body").innerHTML += `
            <li class="py-4 flex flex-col justify-between gap-6 md:flex-row md:justify-cente">
                <div class="flex justify-between md:w-2/5">
                    <h3 class="font-medium">${description}</h3>
                    <p class="md:w-1/2">
                        <span class="px-2 py-1 text-xs text-emerald-600 bg-emerald-50 rounded">${getCategoryNameById(category)}</span>
                    </p>
                </div>
                <div class="flex justify-between items-center md:w-3/5 md:items-start">
                    <span class="hidden md:inline-block md:w-1/3 md:text-right">${transactionDate.getDate()}/${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}</span>
                    ${type === "Gasto" ? `<span class="w-7/12 text-2xl font-bold text-red-500 break-words md:w-1/4 md:text-base md:text-right">-$${amount.toFixed(2)}</span>` : `<span class="w-7/12 text-2xl font-bold text-green-500 break-words md:w-1/4 md:text-base md:text-right">+$${amount.toFixed(2)}</span>`}
                    <p class="text-xs text-indigo-700 lg:w-1/4">
                        <span class="edit-transaction-btn mr-4 cursor-pointer hover:text-zinc-700 lg:block lg:mr-0 lg:text-right" data-id="${id}">Editar</span>
                        <span class="delete-transaction-btn cursor-pointer hover:text-zinc-700 lg:block lg:text-right" data-id="${id}">Eliminar</span>
                    </p>
                </div>
            </li>`
    }
    getIdButton($$(".edit-transaction-btn"), (id) => showEditTransaction(id))
    getIdButton($$(".delete-transaction-btn"), (id) => deleteTransaction(id))
}

const initializeTransactions = () => {
    $("#new-transaction").addEventListener("click", showNewTransaction)
    $("#add-transaction").addEventListener("click", addNewTransaction)
    $("#transaction-cancel-button").addEventListener("click", () => handleCancel("#transaction", "#balance-section"))
    $("#edit-transaction").addEventListener("click", handleEditTransaction)
}