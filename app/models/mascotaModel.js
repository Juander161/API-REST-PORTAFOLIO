const mongoose = require("mongoose")

const mascotaEsquema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  especie: {
    type: String,
    required: true,
    trim: true,
  },
  raza: {
    type: String,
    required: true,
    trim: true,
  },
  fecha_nacimiento: {
    type: Date,
    required: true,
  },
  sexo: {
    type: String,
    enum: ["Macho", "Hembra"],
    required: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  foto: {
    type: String,
    default: "",
  },
  esterilizado: {
    type: Boolean,
    default: false,
  },
  id_propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  historial_medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "historiales",
  },
  fecha_registro: {
    type: Date,
    default: Date.now,
  },
})

const Mascota = mongoose.model("mascotas", mascotaEsquema)
module.exports = Mascota
