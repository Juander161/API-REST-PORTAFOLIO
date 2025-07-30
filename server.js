const app = require("./app/app")
const config = require("./app/config/configuracion")
const conexion = require("./app/config/conexion")
const inicializarAdmin = require("./app/config/initAdmin")

const iniciarServidor = async () => {
  try {
    console.log("🚀 Iniciando servidor...")
    console.log(`📡 Puerto configurado: ${config.PORT}`)
    console.log(`🗄️ Base de datos configurada: ${config.DB ? 'Sí' : 'No'}`)
    
    // Conectar a la base de datos
    await conexion.connect()
    
    // Inicializar administrador por defecto
    await inicializarAdmin()
    
    // Iniciar servidor
    app.listen(config.PORT, () => {
      console.log("🚀 Servidor iniciado exitosamente")
      console.log(`📡 Puerto: ${config.PORT}`)
      console.log(`🌐 URL: http://localhost:${config.PORT}`)
      console.log(`📖 Documentación: http://localhost:${config.PORT}/api-docs`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message)
    process.exit(1)
  }
}

iniciarServidor()

