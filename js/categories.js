// Obtener el nombre de una categoría
const getCategoryNameById = (categoryId) => {
    const categorySelected = getCategories().find(({id}) => id === categoryId)
    return categorySelected ? categorySelected.name : ''
}

// Mostrar pantalla para editar el nombre de una categoría
const showEditCategory = (categoryId) => {
    showElement(["#edit-category"])
    $("#categories-description").value = getCategoryNameById(categoryId)
    $("#edit-category-button").setAttribute("data-id", categoryId)
    hideElement(["#categories-section"])
}

// Actualizar el nombre de una categoria
const updateCategoryName = (categoryId, newName) => {
    const updatedCategories = getCategories().map(category =>
        (category.id === categoryId) ? { ...category, name: newName } : category
    )
    updateData(updatedCategories, null)
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

// Agregar una nueva categoría
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

// Actualizar categorias 
const updateCategories = (categorias) => {
    renderCategoriesTable(categorias)
    renderCategoriesOptions(categorias)
}

// Cargar opciones en filtros y operaciones
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

// Cargar tabla
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
    getIdButton($$(".edit-btn"), (id) => showEditCategory(id))
    getIdButton($$(".delete-btn"), (id) => deleteCategory(id))
}

const initializeCategories = () => {
    $("#edit-category-button").addEventListener("click", handleEditCategory)
    $("#close-error-modal").addEventListener("click", () => hideElement(["#error-modal"]))
    $("#edit-category-cancel-button").addEventListener("click", () => handleCancel("#edit-category", "#categories-section"))
    $("#add-category").addEventListener("click", addNewCategory)
}