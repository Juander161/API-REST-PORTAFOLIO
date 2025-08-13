// Script de pruebas para Docker
// Verifica que todos los servicios estén funcionando correctamente

const http = require('http')

console.log('🧪 Iniciando pruebas de Docker...\n')

// Configuración de pruebas
const tests = [
  {
    name: 'API Health Check',
    url: 'http://localhost:3001/api-docs',
    expectedStatus: [200, 301, 302] // Permitir redirecciones
  },
  {
    name: 'API Root Endpoint',
    url: 'http://localhost:3001/',
    expectedStatus: [200, 301, 302] // Permitir redirecciones
  },
  {
    name: 'API Auth Login Endpoint Structure',
    url: 'http://localhost:3001/api/auth/login',
    method: 'POST',
    data: JSON.stringify({}), // Enviar datos vacíos para probar estructura
    headers: {
      'Content-Type': 'application/json'
    },
    expectedStatus: [400, 401] // Esperamos error de validación o auth
  }
]

// Función para hacer requests HTTP
function makeRequest(test) {
  return new Promise((resolve, reject) => {
    const url = new URL(test.url)
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: test.method || 'GET',
      headers: test.headers || {},
      timeout: 10000
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers
        })
      })
    })

    req.on('error', reject)
    req.on('timeout', () => reject(new Error('Request timeout')))

    if (test.data) {
      req.write(test.data)
    }

    req.end()
  })
}

// Ejecutar pruebas
async function runTests() {
  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      console.log(`🔍 Probando: ${test.name}`)
      const response = await makeRequest(test)
      
      const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus]
      
      if (expectedStatuses.includes(response.statusCode)) {
        console.log(`✅ ${test.name} - PASÓ (${response.statusCode})`)
        passed++
      } else {
        console.log(`❌ ${test.name} - FALLÓ (esperado: ${expectedStatuses.join(' o ')}, recibido: ${response.statusCode})`)
        failed++
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`)
      failed++
    }
    console.log('')
  }

  // Resumen
  console.log('📊 Resumen de pruebas:')
  console.log(`✅ Pasaron: ${passed}`)
  console.log(`❌ Fallaron: ${failed}`)
  console.log(`📈 Total: ${passed + failed}`)

  if (failed === 0) {
    console.log('\n🎉 ¡Todas las pruebas pasaron! Docker está funcionando correctamente.')
    process.exit(0)
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisa la configuración de Docker.')
    process.exit(1)
  }
}

// Esperar un poco antes de empezar las pruebas
console.log('⏳ Esperando 5 segundos para que los servicios se inicien...\n')
setTimeout(runTests, 5000)