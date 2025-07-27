const express = require("express")
const cors = require("cors")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const app = express()

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Middleware de logging
const logAccess = require("./middleware/logger")
app.use(logAccess)

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Clínica Veterinaria Patitas Felices",
      version: "1.0.0",
      description: "API REST para gestión de clínica veterinaria",
      contact: {
        name: "Juan de Dios Valero Casillas",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./app/routes/*.js", "./app/controllers/*.js"],
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// Rutas
const authRoutes = require("./routes/authRouter")
const usuarioRoutes = require("./routes/usuariorouter")
const mascotaRoutes = require("./routes/mascotaRouter")
const historialRoutes = require("./routes/historialRouter")
const citaRoutes = require("./routes/citasRouter")

// Usar rutas
app.use("/api/auth", authRoutes)
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/mascotas", mascotaRoutes)
app.use("/api/historiales", historialRoutes)
app.use("/api/citas", citaRoutes)

// Redirigir la ruta principal a Swagger
app.get("/", (req, res) => {
  res.redirect("/api-docs")
})

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({
    mensaje: "Endpoint no encontrado",
    url: req.originalUrl,
  })
})

module.exports = app
