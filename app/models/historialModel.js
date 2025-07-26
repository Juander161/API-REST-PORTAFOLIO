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
        required: true,
      },
      fecha: {
        type: Date,
        required: true,
      },
      proxima_fecha: {
        type: Date,
        required: true,
      },
      lote: String,
      veterinario: String,
    },
  ],
  alergias: [
    {
      sustancia: {
        type: String,
        required: true,
      },
      gravedad: {
        type: String,
        enum: ["Leve", "Moderada", "Severa"],
        required: true,
      },
      reaccion: String,
    },
  ],
  cirugias: [
    {
      nombre: {
        type: String,
        required: true,
      },
      fecha: {
        type: Date,
        required: true,
      },
      veterinario: String,
      descripcion: String,
      complicaciones: String,
    },
  ],
  enfermedades_cronicas: [String],
  medicamentos_actuales: [
    {
      nombre: {
        type: String,
        required: true,
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
