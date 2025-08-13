const config = require("../config/configuracion")

// Función para crear respuesta de éxito estandarizada
const createSuccessResponse = (mensaje, data = null, meta = null) => {
  const response = {
    success: true,
    mensaje: mensaje || config.DEFAULT_SUCCESS_MESSAGE
  }

  if (data !== null) {
    response.data = data
  }

  if (meta !== null) {
    response.meta = meta
  }

  return response
}

// Función para crear respuesta de error estandarizada
const createErrorResponse = (mensaje, errors = null, statusCode = 500) => {
  const response = {
    success: false,
    mensaje: mensaje || config.DEFAULT_ERROR_MESSAGE,
    statusCode
  }

  if (errors !== null) {
    response.errores = Array.isArray(errors) ? errors : [errors]
  }

  // Solo mostrar detalles del error en desarrollo
  if (config.SHOW_ERROR_DETAILS && errors && typeof errors === 'object' && errors.stack) {
    response.stack = errors.stack
  }

  return response
}

// Middleware para manejo de errores globales
const globalErrorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err)

  let statusCode = 500
  let mensaje = config.DEFAULT_ERROR_MESSAGE

  // Manejo de errores específicos de MongoDB
  if (err.name === 'ValidationError') {
    statusCode = 400
    mensaje = config.ERROR_MESSAGES.VALIDATION_ERROR
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(statusCode).json(createErrorResponse(mensaje, errors, statusCode))
  }

  if (err.name === 'CastError') {
    statusCode = 400
    mensaje = 'ID no válido'
    return res.status(statusCode).json(createErrorResponse(mensaje, null, statusCode))
  }

  if (err.code === 11000) {
    statusCode = 400
    mensaje = 'Datos duplicados'
    const field = Object.keys(err.keyValue)[0]
    const errors = [`El ${field} ya está en uso`]
    return res.status(statusCode).json(createErrorResponse(mensaje, errors, statusCode))
  }

  // Manejo de errores de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    mensaje = config.ERROR_MESSAGES.TOKEN_INVALID
    return res.status(statusCode).json(createErrorResponse(mensaje, null, statusCode))
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    mensaje = config.ERROR_MESSAGES.TOKEN_EXPIRED
    return res.status(statusCode).json(createErrorResponse(mensaje, null, statusCode))
  }

  // Error genérico
  res.status(statusCode).json(createErrorResponse(mensaje, config.SHOW_ERROR_DETAILS ? err.message : null, statusCode))
}

// Middleware para capturar errores asíncronos
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res) => {
  const mensaje = 'Endpoint no encontrado'
  res.status(404).json(createErrorResponse(mensaje, `La ruta ${req.originalUrl} no existe`, 404))
}

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  globalErrorHandler,
  asyncHandler,
  notFoundHandler
}