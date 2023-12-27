const initializeProject = () => {
    initialize()
    initializeMenu()
    updateData()
    initializeFilters()
    initializeCategories()
    initializeTransactions()
}

window.addEventListener("load", initializeProject)