const randomId = () => self.crypto.randomUUID()
const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const data = {
    categories : [{
        id: randomId(),
        name: "Comida"
    },
    {
        id: randomId(),
        name: "Servicios"
    },
    {
        id: randomId(),
        name: "Salidas"
    },
    {
        id: randomId(),
        name: "Educación"
    },
    {
        id: randomId(),
        name: "Transporte"
    },
    {
        id: randomId(),
        name: "Trabajo"
    }]
}

const initialize = () => {
    setData("data", data)
}