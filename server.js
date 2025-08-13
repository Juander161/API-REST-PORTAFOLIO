const app = require("./app/app")
const config = require("./app/config/configuracion")
const conexion = require("./app/config/conexion")
const inicializarAdmin = require("./app/config/initAdmin")

const iniciarServidor = async () => {
  try {
    console.log("🚀 Iniciando servidor...")
    console.log(`📡 Puerto configurado: ${config.PORT}`)
    console.log(`🗄️ Base de datos configurada: ${config.DB ? 'Sí' : 'No'}`)
    console.log(`🌐 Entorno: ${config.NODE_ENV}`)
    console.log(`🔒 CORS configurado para: ${Array.isArray(config.CORS_ORIGIN) ? config.CORS_ORIGIN.join(', ') : config.CORS_ORIGIN}`)
    
    // Conectar a la base de datos
    await conexion.connect()
    
    // Inicializar administrador por defecto
    await inicializarAdmin()
    
    // Iniciar servidor
    const server = app.listen(config.PORT, '0.0.0.0', () => {
      console.log("✅ Servidor iniciado exitosamente")
      console.log(`📡 Puerto: ${config.PORT}`)
      console.log(`🌐 URLs disponibles:`)
      console.log(`   - http://localhost:${config.PORT}`)
      console.log(`   - http://127.0.0.1:${config.PORT}`)
      console.log(`📖 Documentación: http://localhost:${config.PORT}/api-docs`)
      console.log(`🔐 Usuario admin: admin@clinica.com`)
    })

    // Manejo de cierre graceful
    process.on('SIGTERM', () => {
      console.log('🛑 Recibida señal SIGTERM, cerrando servidor...')
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente')
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      console.log('🛑 Recibida señal SIGINT, cerrando servidor...')
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente')
        process.exit(0)
      })
    })

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message)
    console.error("📋 Detalles del error:", error)
    process.exit(1)
  }
}

iniciarServidor()

