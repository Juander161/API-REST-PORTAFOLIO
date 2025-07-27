const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuarioModel")
const config = require("../config/configuracion")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        mensaje: "Acceso denegado. No se proporcionó token de autenticación.",
      })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)
    const usuario = await Usuario.findById(decoded.id).select("-password")

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Token inválido. Usuario no encontrado.",
      })
    }

    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido.",
      error: error.message,
    })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "Acceso denegado. No tienes permisos suficientes.",
      })
    }
    next()
  }
}

module.exports = { auth, authorize }
