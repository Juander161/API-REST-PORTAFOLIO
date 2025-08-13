const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando configuración antes de iniciar...\n')

// Verificar que existe el archivo .env
const envPath = path.join(__dirname, '..', '.env')
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: No se encontró el archivo .env')
  console.log('💡 Solución: Copia env.example a .env')
  console.log('   cp env.example .env')
  process.exit(1)
}

// Cargar configuración
require('dotenv').config()
const config = require('../app/config/configuracion')

// Verificar configuración crítica
const checks = [
  {
    name: 'Puerto',
    value: config.PORT,
    valid: config.PORT && config.PORT > 0 && config.PORT < 65536,
    message: 'Puerto debe estar entre 1 y 65535'
  },
  {
    name: 'Base de datos',
    value: config.DB ? 'Configurada' : 'No configurada',
    valid: !!config.DB,
    message: 'Variable DB debe estar definida'
  },
  {
    name: 'JWT Secret',
    value: config.JWT_SECRET ? 'Configurado' : 'No configurado',
    valid: config.JWT_SECRET && config.JWT_SECRET.length >= 32,
    message: 'JWT_SECRET debe tener al menos 32 caracteres'
  },
  {
    name: 'CORS Origin',
    value: Array.isArray(config.CORS_ORIGIN) ? config.CORS_ORIGIN.join(', ') : config.CORS_ORIGIN,
    valid: !!config.CORS_ORIGIN,
    message: 'CORS_ORIGIN debe estar configurado'
  }
]

let allValid = true

console.log('📋 Verificación de configuración:')
checks.forEach(check => {
  const status = check.valid ? '✅' : '❌'
  console.log(`   ${status} ${check.name}: ${check.value}`)
  if (!check.valid) {
    console.log(`      ⚠️  ${check.message}`)
    allValid = false
  }
})

console.log('')

if (!allValid) {
  console.error('❌ Configuración inválida. Corrige los errores antes de continuar.')
  process.exit(1)
}

// Verificar dependencias críticas
try {
  require('express')
  require('mongoose')
  require('jsonwebtoken')
  require('bcryptjs')
  console.log('✅ Dependencias críticas verificadas')
} catch (error) {
  console.error('❌ Error: Dependencias faltantes')
  console.log('💡 Solución: npm install')
  process.exit(1)
}

console.log('🚀 Configuración válida. Iniciando servidor...\n')

// Iniciar el servidor
require('../server.js')