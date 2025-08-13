// Cargar variables de entorno desde archivo .env si existe (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config()
  } catch (error) {
    console.log('⚠️  No se pudo cargar archivo .env, usando variables de entorno del sistema')
  }
}

// Función para obtener variable de entorno con fallback
const getEnvVar = (key, defaultValue) => {
  const value = process.env[key]
  if (value === undefined || value === null || value === '') {
    console.log(`⚠️  Variable ${key} no definida, usando valor por defecto: ${defaultValue}`)
    return defaultValue
  }
  return value
}

const config = {
  // Configuración del servidor
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '3000')),
  
  // Configuración de la base de datos
  DB: getEnvVar('DB', 'mongodb://localhost:27017/clinica_veterinaria'),
  
  // Configuración de JWT
  JWT_SECRET: getEnvVar('JWT_SECRET', 'mi_secreto_jwt_super_seguro_2024_clinica_veterinaria'),
  JWT_EXPIRE: getEnvVar('JWT_EXPIRE', '24h'),
  
  // Configuración de CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN ? 
    process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : 
    (process.env.NODE_ENV === 'production' ? ['https://tu-dominio.com'] : ['http://localhost:3000', 'http://127.0.0.1:5501', 'http://localhost:5501']),
  
  // Configuración de logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Configuración de Swagger
  SWAGGER_TITLE: 'API Clínica Veterinaria Patitas Felices',
  SWAGGER_VERSION: '1.0.0',
  SWAGGER_DESCRIPTION: 'API REST para gestión de clínica veterinaria',
  
  // Configuración de seguridad
  BCRYPT_ROUNDS: 10,
  
  // Configuración de límites
  BODY_LIMIT: '10mb',
  URL_ENCODED_EXTENDED: false,
  
  // Configuración de timeouts
  REQUEST_TIMEOUT: 30000, // 30 segundos
  
  // Configuración de rate limiting (opcional)
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: 1000, // máximo 100 requests por ventana
  
  // Configuración de sesiones (si se implementa en el futuro)
  SESSION_SECRET: process.env.SESSION_SECRET || 'session_secret_clinica_veterinaria',
  
  // Configuración de email (para futuras funcionalidades)
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Configuración de archivos (para futuras funcionalidades)
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Configuración de validación
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Configuración de roles
  ROLES: {
    ADMIN: 'admin',
    VETERINARIO: 'veterinario',
    RECEPCIONISTA: 'recepcionista',
    CLIENTE: 'cliente'
  },
  
  // Configuración de estados de citas
  ESTADOS_CITA: {
    PENDIENTE: 'pendiente',
    CONFIRMADA: 'confirmada',
    CANCELADA: 'cancelada',
    COMPLETADA: 'completada'
  },
  
  // Configuración de especies de mascotas
  ESPECIES_MASCOTAS: ['Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Otro'],
  
  // Configuración de horarios (para futuras funcionalidades)
  HORARIO_APERTURA: '08:00',
  HORARIO_CIERRE: '18:00',
  
  // Configuración de paginación
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 200,
  
  // Configuración de cache (para futuras optimizaciones)
  CACHE_TTL: 300, // 5 minutos
  
  // Configuración de monitoreo
  ENABLE_METRICS: process.env.ENABLE_METRICS === 'true' || false,
  
  // Configuración de logs
  LOG_FORMAT: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  
  // Configuración de compresión
  ENABLE_COMPRESSION: process.env.ENABLE_COMPRESSION !== 'false',
  
  // Configuración de helmet (seguridad)
  ENABLE_HELMET: process.env.ENABLE_HELMET !== 'false',
  
  // Configuración de rate limiting
  ENABLE_RATE_LIMIT: process.env.ENABLE_RATE_LIMIT !== 'false',
  
  // Configuración de validación de entrada
  ENABLE_VALIDATION: process.env.ENABLE_VALIDATION !== 'false',
  
  // Configuración de sanitización
  ENABLE_SANITIZATION: process.env.ENABLE_SANITIZATION !== 'false',
  
  // Configuración de timezone
  TIMEZONE: process.env.TIMEZONE || 'America/Mexico_City',
  
  // Configuración de idioma
  LOCALE: process.env.LOCALE || 'es-MX',
  
  // Configuración de formato de fecha
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  
  // Configuración de errores
  SHOW_ERROR_DETAILS: process.env.NODE_ENV !== 'production',
  
  // Configuración de respuestas
  DEFAULT_SUCCESS_MESSAGE: 'Operación exitosa',
  DEFAULT_ERROR_MESSAGE: 'Error interno del servidor',
  
  // Configuración de validación de datos
  VALIDATION: {
    NOMBRE_MIN_LENGTH: 2,
    NOMBRE_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
    TELEFONO_MAX_LENGTH: 20,
    DIRECCION_MAX_LENGTH: 200,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 100,
    MASCOTA_NOMBRE_MAX_LENGTH: 50,
    MASCOTA_RAZA_MAX_LENGTH: 50,
    MASCOTA_EDAD_MAX: 30,
    MASCOTA_PESO_MAX: 200,
    HISTORIAL_SINTOMAS_MAX_LENGTH: 500,
    HISTORIAL_DIAGNOSTICO_MAX_LENGTH: 500,
    HISTORIAL_TRATAMIENTO_MAX_LENGTH: 500,
    HISTORIAL_OBSERVACIONES_MAX_LENGTH: 1000,
    CITA_MOTIVO_MAX_LENGTH: 200
  },
  
  // Configuración de mensajes de error
  ERROR_MESSAGES: {
    USER_NOT_FOUND: 'Usuario no encontrado',
    MASCOTA_NOT_FOUND: 'Mascota no encontrada',
    HISTORIAL_NOT_FOUND: 'Historial médico no encontrado',
    CITA_NOT_FOUND: 'Cita no encontrada',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    EMAIL_ALREADY_EXISTS: 'El email ya está registrado',
    UNAUTHORIZED: 'Acceso denegado',
    FORBIDDEN: 'No tienes permisos suficientes',
    VALIDATION_ERROR: 'Error de validación',
    DATABASE_ERROR: 'Error de base de datos',
    TOKEN_INVALID: 'Token inválido',
    TOKEN_EXPIRED: 'Token expirado',
    RATE_LIMIT_EXCEEDED: 'Demasiadas peticiones',
    FILE_TOO_LARGE: 'Archivo demasiado grande',
    INVALID_FILE_TYPE: 'Tipo de archivo no válido'
  },
  
  // Configuración de mensajes de éxito
  SUCCESS_MESSAGES: {
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    USER_DELETED: 'Usuario eliminado exitosamente',
    MASCOTA_CREATED: 'Mascota creada exitosamente',
    MASCOTA_UPDATED: 'Mascota actualizada exitosamente',
    MASCOTA_DELETED: 'Mascota eliminada exitosamente',
    HISTORIAL_CREATED: 'Historial médico creado exitosamente',
    HISTORIAL_UPDATED: 'Historial médico actualizado exitosamente',
    HISTORIAL_DELETED: 'Historial médico eliminado exitosamente',
    CITA_CREATED: 'Cita creada exitosamente',
    CITA_UPDATED: 'Cita actualizada exitosamente',
    CITA_DELETED: 'Cita eliminada exitosamente',
    LOGIN_SUCCESS: 'Login exitoso',
    LOGOUT_SUCCESS: 'Logout exitoso'
  }
}

// Validar seguridad de los secretos
const { validateSecrets } = require('../utils/security')

// Logs de depuración para verificar la configuración
console.log('🔧 Configuración cargada:')
console.log(`   NODE_ENV: ${config.NODE_ENV}`)
console.log(`   PORT: ${config.PORT}`)
console.log(`   DB: ${config.DB}`)
console.log(`   JWT_SECRET: ${config.JWT_SECRET ? 'Configurado' : 'No configurado'}`)

// Validar secretos de seguridad
validateSecrets(config)

module.exports = config
