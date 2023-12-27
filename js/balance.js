// Calcular total por tipo
const total = (transactionType, transactions) => {
    return transactions.filter(({type}) => transactionType === type).reduce((acc, {amount}) => acc + amount, 0)
}

// Calcular totales del balance
const calculateBalance = (transactions) => {
    const totalIncome = total("Ganancia", transactions)
    const totalExpense = total("Gasto", transactions)
    const totalBalance = totalIncome - totalExpense

    return { totalIncome, totalExpense, totalBalance }
}

// Actualizar balance
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