const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const randomId = () => self.crypto.randomUUID()

const cleanContainer = (selector) => $(selector).innerHTML = ""

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

const showErrorModal = (text) =>{
    $(".error-modal-text").innerText = text
    showElement(["#error-modal"])
}

const handleCancel = (hideSection, showSection) => {
    hideElement([hideSection])
    showElement([showSection])
}

// Obtener id para editar o eliminar
const getIdButton = (selectors, callback) => {
    selectors.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id")
            callback(id)
        })
    })
}

// Establecer fecha del día
const today = new Date()
const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
$("#transaction-day").valueAsDate = date

// Establecer primer día del mes en curso
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
$("#day").valueAsDate = firstDayOfMonth