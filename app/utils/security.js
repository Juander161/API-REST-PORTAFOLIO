const crypto = require('crypto')

// Generar un secreto JWT seguro
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex')
}

// Generar un secreto de sesión seguro
const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Generar una contraseña segura
const generateSecurePassword = (length = 16) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Validar que los secretos sean seguros
const validateSecrets = (config) => {
  const warnings = []
  
  // Validar JWT_SECRET
  if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
    warnings.push('⚠️  JWT_SECRET es muy corto o no está definido. Usa al menos 32 caracteres.')
  }
  
  if (config.JWT_SECRET && config.JWT_SECRET.includes('mi_secreto')) {
    warnings.push('⚠️  JWT_SECRET parece ser un valor por defecto. Cambia por un valor único.')
  }
  
  // Validar SESSION_SECRET
  if (!config.SESSION_SECRET || config.SESSION_SECRET.length < 16) {
    warnings.push('⚠️  SESSION_SECRET es muy corto o no está definido. Usa al menos 16 caracteres.')
  }
  
  if (config.SESSION_SECRET && config.SESSION_SECRET.includes('session_secret')) {
    warnings.push('⚠️  SESSION_SECRET parece ser un valor por defecto. Cambia por un valor único.')
  }
  
  // Mostrar advertencias
  if (warnings.length > 0) {
    console.log('\n🔒 ADVERTENCIAS DE SEGURIDAD:')
    warnings.forEach(warning => console.log(warning))
    console.log('\n💡 Genera secretos seguros con:')
    console.log(`   JWT_SECRET: ${generateJWTSecret()}`)
    console.log(`   SESSION_SECRET: ${generateSessionSecret()}`)
    console.log('')
  }
  
  return warnings.length === 0
}

// Sanitizar entrada para prevenir inyección NoSQL
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remover caracteres peligrosos para NoSQL (pero mantener $ en contraseñas)
    return input.replace(/[{}]/g, '')
  }
  
  if (typeof input === 'object' && input !== null) {
    // Si es un objeto, sanitizar recursivamente
    const sanitized = {}
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        // No permitir claves que empiecen con $
        if (!key.startsWith('$')) {
          sanitized[key] = sanitizeInput(input[key])
        }
      }
    }
    return sanitized
  }
  
  return input
}

// Middleware para sanitizar el body de las requests
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body)
  }
  
  if (req.query) {
    req.query = sanitizeInput(req.query)
  }
  
  if (req.params) {
    req.params = sanitizeInput(req.params)
  }
  
  next()
}

// Rate limiting básico en memoria (para desarrollo)
const rateLimitStore = new Map()

const createRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Limpiar entradas antiguas
    for (const [key, requests] of rateLimitStore.entries()) {
      rateLimitStore.set(key, requests.filter(time => time > windowStart))
      if (rateLimitStore.get(key).length === 0) {
        rateLimitStore.delete(key)
      }
    }
    
    // Obtener requests del IP actual
    const requests = rateLimitStore.get(ip) || []
    const recentRequests = requests.filter(time => time > windowStart)
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        mensaje: 'Demasiadas peticiones. Intenta de nuevo más tarde.',
        statusCode: 429
      })
    }
    
    // Agregar request actual
    recentRequests.push(now)
    rateLimitStore.set(ip, recentRequests)
    
    next()
  }
}

module.exports = {
  generateJWTSecret,
  generateSessionSecret,
  generateSecurePassword,
  validateSecrets,
  sanitizeInput,
  sanitizeBody,
  createRateLimit
}