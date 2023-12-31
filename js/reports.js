// Obtener nombre del mes
const getMonthWithYear = (monthNumber, year) => {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    if (monthNumber >= 0 && monthNumber <= 11) {
        return `${months[monthNumber]}/${year}`
    }
}

// Obtener el total de ganancias, gastos y balance por categoría
const totalAmountByCategory = () => {
    return getTransactions().reduce((acc, transaction) => {
        const { category, amount, type } = transaction
        const transactionAmount = type === 'Ganancia' ? amount : -amount

        if (!acc[category]) {
            acc[category] = {
                totalIncome: 0,
                totalExpense: 0,
                totalBalance: 0,
            }
        }

        if (type === 'Ganancia') {
            acc[category].totalIncome += amount
        } else {
            acc[category].totalExpense += amount
        }

        acc[category].totalBalance += transactionAmount

        return acc
    }, {})
}

// Categoría con un mayor valor
const categoryWithMaxValue = (property) => {
    const totalAmounts = totalAmountByCategory()
    let maxCategory = Object.keys(totalAmounts)[0]

    for (const category in totalAmounts) {
        if (totalAmounts[category][property] > totalAmounts[maxCategory][property]) {
            maxCategory = category
        }
    }

    const categoryName = getCategoryNameById(maxCategory)
    const maxAmount = totalAmounts[maxCategory][property]

    return { categoryName, maxAmount }
}

// Obtener el total de ganancias, gastos y balance por mes
const totalAmountByMonth = () => {
    return getTransactions().reduce((acc, transaction) => {
        const { day, amount, type } = transaction
        const transactionAmount = type === 'Ganancia' ? amount : -amount

        const year = new Date(day).getFullYear()
        const month = new Date(day).getMonth()

        if (!acc[year]) {
            acc[year] = {}
        }

        if (!acc[year][month]) {
            acc[year][month] = {
                totalIncome: 0,
                totalExpense: 0,
                totalBalance: 0,
            }
        }

        if (type === 'Ganancia') {
            acc[year][month].totalIncome += amount
        } else {
            acc[year][month].totalExpense += amount
        }

        acc[year][month].totalBalance += transactionAmount

        return acc
    }, {})
}

// Mes con un mayor valor
const monthWithMaxValue = (property) => {
    const totalAmounts = totalAmountByMonth()
    let maxMonth = { year: null, month: null }
    let maxAmount = null

    for (const year in totalAmounts) {
        for (const month in totalAmounts[year]) {
            const currentAmount = totalAmounts[year][month][property]
            if (maxAmount === null || currentAmount > maxAmount) {
                maxAmount = currentAmount
                maxMonth = { year, month }
            }
        }
    }

    return { maxMonth, maxAmount }
}

// Cargar reportes
// Resumen por categoría
const renderCategorySummary = (title, categoryType, amount) => {
    const { categoryName, maxAmount } = categoryWithMaxValue(categoryType)
    $(".reports-summary").innerHTML += `
        <li class="my-6 md:flex md:justify-between">
            <p class="mb-2 font-medium md:mb-0">${title}</p>
            <div class="flex justify-between md:w-1/3">
                <span class="px-3 py-1 text-xs text-emerald-600 bg-emerald-50 rounded">${categoryName}</span>
                <span class="font-medium ${amount < 0 ? 'text-red-500' : amount > 0 ? 'text-green-500' : ''}">${amount > 0 ? '+' : amount < 0 ? '-' : ''}$${Math.abs(maxAmount).toFixed(2)}</span>
            </div>
        </li>`
}

// Resumen por mes
const renderMonthSummary = (title, property, amount) => {
    const { maxMonth, maxAmount } = monthWithMaxValue(property)
    $(".reports-summary").innerHTML += `
        <li class="my-6 md:flex md:justify-between">
            <p class="mb-2 font-medium md:mb-0">${title}</p>
            <div class="flex justify-between md:w-1/3">
                <span>${getMonthWithYear(maxMonth.month, maxMonth.year)}</span>
                <span class="font-medium ${amount < 0 ? 'text-red-500' : 'text-green-500'}">${amount > 0 ? '+' : '-'}$${Math.abs(maxAmount).toFixed(2)}</span>
            </div>
        </li>`
}

// Categoría con mayor ganancia
const renderCategoryWithMaxIncome = () => renderCategorySummary("Categoría con mayor ganancia", "totalIncome", 1)

// Categoría con mayor gasto
const renderCategoryWithMaxExpense = () => renderCategorySummary("Categoría con mayor gasto", "totalExpense", -1)

// Categoría con mayor balance
const renderCategoryWithMaxBalance = () => renderCategorySummary("Categoría con mayor balance", "totalBalance", 0)

// Mes con mayor ganancia
const renderMonthWithMaxIncome = () => renderMonthSummary("Mes con mayor ganancia", "totalIncome", 1)

// Mes con mayor gasto
const renderMonthWithMaxExpense = () => renderMonthSummary("Mes con mayor gasto", "totalExpense", -1)

// Cargar todo el resumen
const renderSummary = () => {
    cleanContainer(".reports-summary")
    renderCategoryWithMaxIncome()
    renderCategoryWithMaxExpense()
    renderCategoryWithMaxBalance()
    renderMonthWithMaxIncome()
    renderMonthWithMaxExpense()
}

// Cargar totales
// Por categorías
const renderTotalCategories = () => {
    const totalsByCategory = totalAmountByCategory()
    cleanContainer(".reports-categories")
    for (const category in totalsByCategory) {
        const { totalIncome, totalExpense, totalBalance } = totalsByCategory[category]
        $(".reports-categories").innerHTML += `
            <tr>
                <td class="pr-4 pb-6 font-medium md:pr-0">${getCategoryNameById(category)}</td>
                <td class="pr-4 pb-6 text-right text-green-500 md:pr-0">+$${totalIncome.toFixed(2)}</td>
                <td class="pr-4 pb-6 text-right text-red-500 md:pr-0">-$${totalExpense.toFixed(2)}</td>
                <td class="pb-6 text-right">$${totalBalance.toFixed(2)}</td>
            </tr>`
    }
}

// Por mes
const renderTotalMonths = () => {
    const totalsByMonth = totalAmountByMonth()
    cleanContainer(".reports-months")
    for (const year in totalsByMonth) {
        for (const month in totalsByMonth[year]) {
            const { totalIncome, totalExpense, totalBalance } = totalsByMonth[year][month]
            $(".reports-months").innerHTML += `
                <tr>
                    <td class="pr-4 pb-6 font-medium md:pr-0">${getMonthWithYear(month, year)}</td>
                    <td class="pr-4 pb-6 text-right text-green-500 md:pr-0">+$${totalIncome.toFixed(2)}</td>
                    <td class="pr-4 pb-6 text-right text-red-500 md:pr-0">-$${totalExpense.toFixed(2)}</td>
                    <td class="pb-6 text-right">$${totalBalance.toFixed(2)}</td>
                </tr>`
        }
    }
}

// Actualizar reportes
const updateReports = () => {
    const transactions = getTransactions()
    const hasIncome = transactions.some(({type}) => type === 'Ganancia')
    const hasExpense = transactions.some(({type}) => type === 'Gasto')

    if (hasIncome && hasExpense) {
        showElement([".has-reports"])
        hideElement([".none-reports"])
        renderSummary()
        renderTotalCategories()
        renderTotalMonths()
    } else {
        showElement([".none-reports"])
        hideElement([".has-reports"])
    }
}