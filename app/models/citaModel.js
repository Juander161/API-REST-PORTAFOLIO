const mongoose = require("mongoose")

const citaEsquema = mongoose.Schema({
  id_mascota: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mascotas",
    required: true,
  },
  id_veterinario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  fecha_hora: {
    type: Date,
    required: true,
  },
  motivo: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: String,
    enum: ["Programada", "Confirmada", "Completada", "Cancelada"],
    default: "Programada",
  },
  notas: {
    type: String,
    trim: true,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
})

const Cita = mongoose.model("citas", citaEsquema)
module.exports = Cita
