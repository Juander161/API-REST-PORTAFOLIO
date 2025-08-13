const mongoose = require("mongoose")

const historialEsquema = mongoose.Schema({
  id_mascota: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mascotas",
    required: true,
  },
  vacunas: [
    {
      nombre: {
        type: String,
        required: false,
      },
      fecha: {
        type: Date,
        required: false,
      },
      proxima_fecha: {
        type: Date,
        required: false,
      },
      lote: String,
      veterinario: String,
    },
  ],
  alergias: [
    {
      sustancia: {
        type: String,
        required: false,
      },
      gravedad: {
        type: String,
        enum: ["Leve", "Moderada", "Severa"],
        required: false,
      },
      reaccion: String,
    },
  ],
  cirugias: [
    {
      nombre: {
        type: String,
        required: false,
      },
      fecha: {
        type: Date,
        required: false,
      },
      veterinario: String,
      descripcion: String,
      complicaciones: String,
    },
  ],
  enfermedades_cronicas: [],
  medicamentos_actuales: [
    {
      nombre: {
        type: String,
        required: false,
      },
      dosis: String,
      frecuencia: String,
    },
  ],
  notas_generales: String,
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
})

const Historial = mongoose.model("historiales", historialEsquema)
module.exports = Historial
