const Usuario = require("../models/usuarioModel")
const jwt = require("jsonwebtoken")
const config = require("../config/configuracion")
const { createSuccessResponse, createErrorResponse, asyncHandler } = require("../middleware/errorHandler")

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  })
}

// Registro de usuario
const registro = asyncHandler(async (req, res) => {
  const { nombre, email, password, telefono, direccion, rol } = req.body

  // Verificar si el usuario ya existe
  const usuarioExistente = await Usuario.findOne({ email })
  if (usuarioExistente) {
    return res.status(400).json(
      createErrorResponse(config.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, null, 400)
    )
  }

  // Crear nuevo usuario
  const usuario = new Usuario({
    nombre,
    email,
    password,
    telefono,
    direccion,
    rol: rol || "cliente",
  })

  await usuario.save()

  // Generar token
  const token = generarToken(usuario._id)

  const userData = {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    rol: usuario.rol,
  }

  res.status(201).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.USER_CREATED, { usuario: userData, token })
  )
})

// Login de usuario
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Verificar si el usuario existe
  const usuario = await Usuario.findOne({ email })
  if (!usuario) {
    return res.status(401).json(
      createErrorResponse(config.ERROR_MESSAGES.INVALID_CREDENTIALS, null, 401)
    )
  }

  // Verificar password
  const passwordValido = await usuario.comparePassword(password)
  
  if (!passwordValido) {
    return res.status(401).json(
      createErrorResponse(config.ERROR_MESSAGES.INVALID_CREDENTIALS, null, 401)
    )
  }

  // Generar token
  const token = generarToken(usuario._id)

  const userData = {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    rol: usuario.rol,
  }

  res.status(200).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.LOGIN_SUCCESS, { usuario: userData, token })
  )
})

// Obtener perfil del usuario autenticado
const obtenerPerfil = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findById(req.usuario._id)
    .select("-password")
    .populate("mascotas")

  res.status(200).json(
    createSuccessResponse("Perfil obtenido exitosamente", { usuario })
  )
})

module.exports = {
  registro,
  login,
  obtenerPerfil,
}
