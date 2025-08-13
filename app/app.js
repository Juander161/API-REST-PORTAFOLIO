const express = require("express")
const cors = require("cors")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const config = require("./config/configuracion")
const app = express()

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman) en desarrollo
    if (!origin && config.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    // Si CORS_ORIGIN es un array, verificar si el origin está incluido
    if (Array.isArray(config.CORS_ORIGIN)) {
      if (config.CORS_ORIGIN.includes(origin)) {
        return callback(null, true)
      }
    } else {
      // Si es un string, verificar directamente
      if (config.CORS_ORIGIN === origin) {
        return callback(null, true)
      }
    }
    
    // En desarrollo, ser más permisivo
    if (config.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    // En producción con Docker, permitir health checks
    if (config.NODE_ENV === 'production') {
      return callback(null, true)
    }
    
    callback(new Error('No permitido por CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Middleware de seguridad
const { sanitizeBody, createRateLimit } = require("./utils/security")

// Aplicar sanitización a todas las rutas
app.use(sanitizeBody)

// Aplicar rate limiting si está habilitado
if (config.ENABLE_RATE_LIMIT) {
  app.use(createRateLimit(config.RATE_LIMIT_WINDOW_MS, config.RATE_LIMIT_MAX_REQUESTS))
}

// Middleware de logging
const logAccess = require("./middleware/logger")
app.use(logAccess)

// Middleware de manejo de errores
const { globalErrorHandler, notFoundHandler } = require("./middleware/errorHandler")

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Clínica Veterinaria Patitas Felices",
      version: "1.0.0",
      description: `API REST completa para gestión de clínica veterinaria\n\n## 🔐 Credenciales de Prueba\n\n### Administradores:\n- **Email:** admin.test@clinica.com **Password:** admin123\n- **Email:** carlos.admin@clinica.com **Password:** Admin123!\n\n### Veterinarios:\n- **Email:** test.vet@clinica.com **Password:** TestVet123!\n- **Email:** juan.vet@clinica.com **Password:** Vet123!\n\n### Clientes:\n- **Email:** test.cliente@email.com **Password:** TestCliente123!\n- **Email:** cliente1@email.com **Password:** Cliente123!\n\n## 📊 Estado del Sistema\n- ✅ 3 Administradores, 3 Veterinarios, 10 Clientes\n- ✅ 10 Mascotas con historiales médicos\n- ✅ 10 Citas programadas\n- ✅ Sistema completamente funcional`,
      contact: {
        name: "Juan de Dios Valero Casillas",
        email: "admin.test@clinica.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "Servidor de desarrollo - Sistema completo con datos de prueba",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresa el token JWT obtenido del endpoint /api/auth/login"
        },
      },
    },
  },
  apis: ["./app/routes/*.js", "./app/controllers/*.js", "./app/docs/*.js"],
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// Rutas
const authRoutes = require("./routes/authRouter")
const usuarioRoutes = require("./routes/usuarioRouter")
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
app.use("*", notFoundHandler)

// Manejo de errores global (debe ir al final)
app.use(globalErrorHandler)

module.exports = app
