const express = require("express")
const cors = require("cors")
const app = express()

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Middleware de logging
const logAccess = require("./middleware/logger")
app.use(logAccess)

// Rutas
const authRoutes = require("./routes/authRoutes")
const usuarioRoutes = require("./routes/usuarioRoutes")
const mascotaRoutes = require("./routes/mascotaRoutes")
const historialRoutes = require("./routes/historialRoutes")
const citaRoutes = require("./routes/citaRoutes")

// Usar rutas
app.use("/api/auth", authRoutes)
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/mascotas", mascotaRoutes)
app.use("/api/historiales", historialRoutes)
app.use("/api/citas", citaRoutes)

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    mensaje: "¡Bienvenido a la API de Clínica Veterinaria Patitas Felices!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      usuarios: "/api/usuarios",
      mascotas: "/api/mascotas",
      historiales: "/api/historiales",
      citas: "/api/citas",
    },
  })
})

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({
    mensaje: "Endpoint no encontrado",
    url: req.originalUrl,
  })
})

module.exports = app
