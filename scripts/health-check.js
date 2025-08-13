const http = require('http')
const config = require('../app/config/configuracion')

const healthCheck = () => {
  const options = {
    hostname: 'localhost',
    port: config.PORT,
    path: '/api-docs',
    method: 'GET',
    timeout: 5000
  }

  console.log(`🔍 Verificando salud del servidor en http://localhost:${config.PORT}...`)

  const req = http.request(options, (res) => {
    console.log(`✅ Servidor respondiendo - Status: ${res.statusCode}`)
    console.log(`📡 Headers CORS:`)
    console.log(`   Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'No configurado'}`)
    console.log(`   Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'No configurado'}`)
    console.log(`   Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || 'No configurado'}`)
    
    if (res.statusCode === 200) {
      console.log('🎉 Servidor funcionando correctamente')
    } else {
      console.log('⚠️  Servidor respondiendo pero con código de estado inesperado')
    }
  })

  req.on('error', (err) => {
    console.error('❌ Error al conectar con el servidor:')
    console.error(`   ${err.message}`)
    console.log('\n💡 Posibles soluciones:')
    console.log('   1. Verificar que el servidor esté iniciado: npm start')
    console.log('   2. Verificar que el puerto esté disponible')
    console.log('   3. Verificar la configuración de red')
  })

  req.on('timeout', () => {
    console.error('⏰ Timeout al conectar con el servidor')
    req.destroy()
  })

  req.end()
}

// Ejecutar verificación
healthCheck()

// Verificar cada 30 segundos si se pasa el parámetro --watch
if (process.argv.includes('--watch')) {
  console.log('👀 Modo watch activado - verificando cada 30 segundos...')
  setInterval(healthCheck, 30000)
}