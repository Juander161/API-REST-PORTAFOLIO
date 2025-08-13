const LogAcceso = require("../models/logAccesModel")
const config = require("../config/configuracion")

// Cache en memoria para logs cuando la DB no esté disponible
let logCache = []
let dbAvailable = true
let lastDbCheck = 0
const DB_CHECK_INTERVAL = 30000 // 30 segundos

const logAccess = async (req, res, next) => {
  const originalSend = res.send

  res.send = function (data) {
    // Guardar log después de que se complete la respuesta
    const logData = {
      id_usuario: req.usuario ? req.usuario._id : null,
      endpoint: req.originalUrl,
      metodo: req.method,
      ip: req.ip || req.connection.remoteAddress,
      user_agent: req.get("User-Agent"),
      status_code: res.statusCode,
      fecha: new Date()
    }

    // Intentar guardar en base de datos
    saveLogSafely(logData)

    originalSend.call(this, data)
  }

  next()
}

const saveLogSafely = async (logData) => {
  const now = Date.now()
  
  try {
    // Si la DB no está disponible y no hemos verificado recientemente
    if (!dbAvailable && (now - lastDbCheck) > DB_CHECK_INTERVAL) {
      await testDbConnection()
    }

    if (dbAvailable) {
      // Intentar guardar logs en cache primero
      if (logCache.length > 0) {
        await flushLogCache()
      }
      
      // Guardar log actual
      await new LogAcceso(logData).save()
    } else {
      // Agregar al cache si la DB no está disponible
      addToCache(logData)
    }
  } catch (error) {
    console.error("Error al guardar log de acceso:", error.message)
    dbAvailable = false
    lastDbCheck = now
    addToCache(logData)
  }
}

const addToCache = (logData) => {
  logCache.push(logData)
  
  // Limitar el tamaño del cache para evitar memory leaks
  const MAX_CACHE_SIZE = 1000
  if (logCache.length > MAX_CACHE_SIZE) {
    logCache = logCache.slice(-MAX_CACHE_SIZE) // Mantener solo los últimos 1000
    console.warn(`⚠️  Cache de logs alcanzó el límite máximo (${MAX_CACHE_SIZE}). Se eliminaron logs antiguos.`)
  }
}

const flushLogCache = async () => {
  if (logCache.length === 0) return

  try {
    console.log(`📝 Guardando ${logCache.length} logs del cache...`)
    await LogAcceso.insertMany(logCache)
    logCache = []
    console.log("✅ Logs del cache guardados exitosamente")
  } catch (error) {
    console.error("❌ Error al guardar logs del cache:", error.message)
    throw error
  }
}

const testDbConnection = async () => {
  try {
    await LogAcceso.findOne().limit(1)
    dbAvailable = true
    lastDbCheck = Date.now()
    console.log("✅ Conexión a DB restaurada para logs")
  } catch (error) {
    dbAvailable = false
    lastDbCheck = Date.now()
    console.warn("⚠️  DB no disponible para logs")
  }
}

// Función para limpiar el cache periódicamente (llamar desde el servidor principal)
const cleanupLogCache = () => {
  if (logCache.length > 0) {
    console.log(`🧹 Limpiando cache de logs: ${logCache.length} entradas`)
    flushLogCache().catch(err => {
      console.error("Error al limpiar cache de logs:", err.message)
    })
  }
}

// Limpiar cache cada 5 minutos
setInterval(cleanupLogCache, 5 * 60 * 1000)

module.exports = logAccess

module.exports = logAccess
