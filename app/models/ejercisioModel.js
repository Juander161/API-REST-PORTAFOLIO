const mongoose = require("mongoose")
const ejercicioEsquema = mongoose.Schema({
    Nombre: {
    type: String,
    required: true
    },
    tipo: {
    type: String,
    required: true
    },
    duracion: {
    type: Number,
    required: true
    },
    calorias:{
    type: Number,
    required: true
    }
})

const ejercicio = mongoose.model("ejercicios",ejercicioEsquema)
module.exports = ejercicio
