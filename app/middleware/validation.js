const config = require("../config/configuracion")

// Función para validar email
const isValidEmail = (email) => {
  return config.EMAIL_REGEX.test(email)
}

// Función para validar longitud de string
const isValidLength = (str, min, max) => {
  if (!str || typeof str !== 'string') return false
  return str.trim().length >= min && str.trim().length <= max
}

// Función para validar ObjectId de MongoDB
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Middleware para validar registro de usuario
const validateUserRegistration = (req, res, next) => {
  const { nombre, email, password, telefono, direccion, rol } = req.body
  const errors = []

  // Validar nombre
  if (!nombre || !isValidLength(nombre, config.VALIDATION.NOMBRE_MIN_LENGTH, config.VALIDATION.NOMBRE_MAX_LENGTH)) {
    errors.push(`El nombre debe tener entre ${config.VALIDATION.NOMBRE_MIN_LENGTH} y ${config.VALIDATION.NOMBRE_MAX_LENGTH} caracteres`)
  }

  // Validar email
  if (!email || !isValidEmail(email)) {
    errors.push('El email no tiene un formato válido')
  }

  if (email && email.length > config.VALIDATION.EMAIL_MAX_LENGTH) {
    errors.push(`El email no puede exceder ${config.VALIDATION.EMAIL_MAX_LENGTH} caracteres`)
  }

  // Validar password
  if (!password || !isValidLength(password, config.VALIDATION.PASSWORD_MIN_LENGTH, config.VALIDATION.PASSWORD_MAX_LENGTH)) {
    errors.push(`La contraseña debe tener entre ${config.VALIDATION.PASSWORD_MIN_LENGTH} y ${config.VALIDATION.PASSWORD_MAX_LENGTH} caracteres`)
  }

  // Validar teléfono
  if (!telefono || telefono.length > config.VALIDATION.TELEFONO_MAX_LENGTH) {
    errors.push(`El teléfono es requerido y no puede exceder ${config.VALIDATION.TELEFONO_MAX_LENGTH} caracteres`)
  }

  // Validar dirección
  if (!direccion || direccion.length > config.VALIDATION.DIRECCION_MAX_LENGTH) {
    errors.push(`La dirección es requerida y no puede exceder ${config.VALIDATION.DIRECCION_MAX_LENGTH} caracteres`)
  }

  // Validar rol
  if (rol && !Object.values(config.ROLES).includes(rol)) {
    errors.push(`El rol debe ser uno de: ${Object.values(config.ROLES).join(', ')}`)
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      mensaje: config.ERROR_MESSAGES.VALIDATION_ERROR,
      errores: errors
    })
  }

  next()
}

// Middleware para validar login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = []

  if (!email || !isValidEmail(email)) {
    errors.push('El email es requerido y debe tener un formato válido')
  }

  if (!password) {
    errors.push('La contraseña es requerida')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      mensaje: config.ERROR_MESSAGES.VALIDATION_ERROR,
      errores: errors
    })
  }

  next()
}

// Middleware para validar ObjectId en parámetros
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName]
    
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        mensaje: `El ${paramName} proporcionado no es válido`
      })
    }

    next()
  }
}

// Middleware para validar creación de mascota
const validateMascotaCreation = (req, res, next) => {
  const { nombre, especie, raza, fecha_nacimiento, sexo, color, id_propietario } = req.body
  const errors = []

  // Validar nombre
  if (!nombre || !isValidLength(nombre, 1, config.VALIDATION.MASCOTA_NOMBRE_MAX_LENGTH)) {
    errors.push(`El nombre de la mascota es requerido y no puede exceder ${config.VALIDATION.MASCOTA_NOMBRE_MAX_LENGTH} caracteres`)
  }

  // Validar especie
  if (!especie || !config.ESPECIES_MASCOTAS.includes(especie)) {
    errors.push(`La especie debe ser una de: ${config.ESPECIES_MASCOTAS.join(', ')}`)
  }

  // Validar raza
  if (!raza || raza.length > config.VALIDATION.MASCOTA_RAZA_MAX_LENGTH) {
    errors.push(`La raza es requerida y no puede exceder ${config.VALIDATION.MASCOTA_RAZA_MAX_LENGTH} caracteres`)
  }

  // Validar fecha de nacimiento
  if (!fecha_nacimiento || isNaN(Date.parse(fecha_nacimiento))) {
    errors.push('La fecha de nacimiento es requerida y debe ser una fecha válida')
  } else {
    const fechaNac = new Date(fecha_nacimiento)
    const ahora = new Date()
    if (fechaNac > ahora) {
      errors.push('La fecha de nacimiento no puede ser futura')
    }
    // Verificar que la mascota no sea demasiado vieja (más de 30 años)
    const edadMaxima = new Date()
    edadMaxima.setFullYear(edadMaxima.getFullYear() - 30)
    if (fechaNac < edadMaxima) {
      errors.push('La fecha de nacimiento no puede ser anterior a 30 años')
    }
  }

  // Validar sexo
  if (!sexo || !['Macho', 'Hembra'].includes(sexo)) {
    errors.push('El sexo debe ser "Macho" o "Hembra"')
  }

  // Validar color
  if (!color) {
    errors.push('El color es requerido')
  }

  // Validar id_propietario (se validará en el controlador según el rol del usuario)
  // Para admin/veterinario es requerido, para cliente se asigna automáticamente
  if (id_propietario && !isValidObjectId(id_propietario)) {
    errors.push('El ID del propietario debe ser válido si se proporciona')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      mensaje: config.ERROR_MESSAGES.VALIDATION_ERROR,
      errores: errors
    })
  }

  next()
}

// Middleware para validar creación de cita
const validateCitaCreation = (req, res, next) => {
  const { id_mascota, id_veterinario, fecha_hora, motivo } = req.body
  const errors = []

  // Validar id_mascota
  if (!id_mascota || !isValidObjectId(id_mascota)) {
    errors.push('El ID de la mascota es requerido y debe ser válido')
  }

  // Validar id_veterinario
  if (!id_veterinario || !isValidObjectId(id_veterinario)) {
    errors.push('El ID del veterinario es requerido y debe ser válido')
  }

  // Validar fecha_hora
  if (!fecha_hora || isNaN(Date.parse(fecha_hora))) {
    errors.push('La fecha y hora son requeridas y deben ser válidas')
  } else {
    const fechaCita = new Date(fecha_hora)
    const ahora = new Date()
    if (fechaCita <= ahora) {
      errors.push('La fecha de la cita debe ser futura')
    }
  }

  // Validar motivo
  if (!motivo || motivo.length > config.VALIDATION.CITA_MOTIVO_MAX_LENGTH) {
    errors.push(`El motivo es requerido y no puede exceder ${config.VALIDATION.CITA_MOTIVO_MAX_LENGTH} caracteres`)
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      mensaje: config.ERROR_MESSAGES.VALIDATION_ERROR,
      errores: errors
    })
  }

  next()
}

module.exports = {
  validateUserRegistration,
  validateLogin,
  validateObjectId,
  validateMascotaCreation,
  validateCitaCreation,
  isValidEmail,
  isValidLength,
  isValidObjectId
}