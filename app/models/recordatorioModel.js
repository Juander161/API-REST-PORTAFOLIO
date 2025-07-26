const mongoose = require("mongoose")

const recordatorioEsquema = mongoose.Schema({
  tipo: {
    type: String,
    enum: ["vacuna", "cita"],
    required: true,
  },
  id_referencia: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fecha_recordatorio: {
    type: Date,
    required: true,
  },
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  enviado: {
    type: Boolean,
    default: false,
  },
  metodo: {
    type: String,
    enum: ["email"],
    default: "email",
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
})

const Recordatorio = mongoose.model("recordatorios", recordatorioEsquema)
module.exports = Recordatorio
