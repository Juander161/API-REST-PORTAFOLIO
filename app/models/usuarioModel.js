const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const config = require("../config/configuracion")

const usuarioEsquema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  telefono: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["cliente", "veterinario", "recepcionista", "admin"],
    default: "cliente",
  },
  mascotas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mascotas",
    },
  ],
  fecha_registro: {
    type: Date,
    default: Date.now,
  },
})

// Encriptar password antes de guardar
usuarioEsquema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, config.BCRYPT_ROUNDS)
  next()
})

// Método para comparar passwords
usuarioEsquema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const Usuario = mongoose.model("usuarios", usuarioEsquema)
module.exports = Usuario
