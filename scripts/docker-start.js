// Script de inicio específico para Docker
// Optimizado para contenedores con manejo de señales y health checks

console.log('🐳 Iniciando API Clínica Veterinaria en Docker...')
console.log(`📅 Fecha: ${new Date().toISOString()}`)

// Verificar variables de entorno críticas
const requiredVars = ['NODE_ENV', 'PORT', 'DB', 'JWT_SECRET']
const missingVars = []

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName)
  }
})

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars.join(', '))
  console.error('💡 Verifica la configuración de docker-compose.yml')
  process.exit(1)
}

console.log('✅ Variables de entorno verificadas')
console.log(`🌐 Entorno: ${process.env.NODE_ENV}`)
console.log(`📡 Puerto: ${process.env.PORT}`)
console.log(`🗄️ Base de datos: ${process.env.DB}`)
console.log(`🔒 CORS: ${process.env.CORS_ORIGIN}`)

// Configurar manejo de señales para Docker
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando aplicación...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando aplicación...')
  process.exit(0)
})

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Error no capturado:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promesa rechazada no manejada:', reason)
  process.exit(1)
})

console.log('🚀 Iniciando servidor...')

// Iniciar el servidor
require('../server.js')