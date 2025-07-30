const Usuario = require("../models/usuarioModel")
const jwt = require("jsonwebtoken")
const config = require("../config/configuracion")

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  })
}

// Registro de usuario
const registro = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion, rol } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: "El email ya está registrado",
      })
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

    res.status(201).json({
      success: true,
      mensaje: "Usuario registrado exitosamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    })
  }
}

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      })
    }

    // Verificar password
    const passwordValido = await usuario.comparePassword(password)
    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      })
    }

    // Generar token
    const token = generarToken(usuario._id)

    res.status(200).json({
      success: true,
      mensaje: "Login exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al hacer login",
      error: error.message,
    })
  }
}

// Obtener perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id)
      .select("-password")
      .populate("mascotas")

    res.status(200).json({
      success: true,
      mensaje: "Perfil obtenido exitosamente",
      usuario,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener perfil",
      error: error.message,
    })
  }
}

module.exports = {
  registro,
  login,
  obtenerPerfil,
}
