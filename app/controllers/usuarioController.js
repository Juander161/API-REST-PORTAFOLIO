const Usuario = require("../models/usuarioModel")

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}).select("-password").populate("mascotas")

    res.status(200).json({
      success: true,
      mensaje: usuarios.length > 0 ? "Usuarios obtenidos exitosamente" : "No hay usuarios registrados",
      usuarios: usuarios,
      total: usuarios.length
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
      error: error.message,
    })
  }
}

const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-password").populate("mascotas")

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      })
    }

    res.status(200).json({
      mensaje: "Usuario obtenido exitosamente",
      usuario,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuario",
      error: error.message,
    })
  }
}

const actualizarUsuario = async (req, res) => {
  try {
    const { password, ...datosActualizacion } = req.body

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, datosActualizacion, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      })
    }

    res.status(200).json({
      mensaje: "Usuario actualizado exitosamente",
      usuario,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar usuario",
      error: error.message,
    })
  }
}

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id)

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      })
    }

    res.status(200).json({
      mensaje: "Usuario eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar usuario",
      error: error.message,
    })
  }
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
}
