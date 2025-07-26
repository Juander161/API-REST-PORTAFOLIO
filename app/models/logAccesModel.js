const mongoose = require("mongoose")

const logAccesoEsquema = mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
  },
  endpoint: {
    type: String,
    required: true,
  },
  metodo: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    required: true,
  },
  user_agent: String,
  status_code: Number,
})

const LogAcceso = mongoose.model("logs_acceso", logAccesoEsquema)
module.exports = LogAcceso
