const randomId = () => self.crypto.randomUUID()

const getData = (key) => JSON.parse(localStorage.getItem(key))

const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const getCategories = () => getData("data").categories || []

const updateData = (updatedCategories) => {
    const updatedData = { categories: updatedCategories || getCategories() }
    setData("data", updatedData)
    updateCategories(updatedData.categories)
}

const data = {
    categories : [
        { id: randomId(), name: "Comida" },
        { id: randomId(), name: "Servicios" },
        { id: randomId(), name: "Salidas" },
        { id: randomId(), name: "Educación" },
        { id: randomId(), name: "Transporte" },
        { id: randomId(), name: "Trabajo" }
    ]
}

const storedData = getData("data")

const initialize = () => {
    if (!storedData)
        setData("data", data)
}