const Usuario = require("../models/usuarioModel")
const { createSuccessResponse, createErrorResponse, asyncHandler } = require("../middleware/errorHandler")
const { deleteUserWithPets } = require("../utils/transactions")
const config = require("../config/configuracion")

const obtenerUsuarios = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || config.DEFAULT_PAGE_SIZE
  const skip = (page - 1) * limit

  // Validar límites de paginación
  if (limit > config.MAX_PAGE_SIZE) {
    return res.status(400).json(
      createErrorResponse(`El límite máximo es ${config.MAX_PAGE_SIZE}`, null, 400)
    )
  }

  const usuarios = await Usuario.find({})
    .select("-password")
    .populate("mascotas")
    .skip(skip)
    .limit(limit)
    .sort({ fecha_registro: -1 })

  const total = await Usuario.countDocuments({})

  const meta = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  }

  res.status(200).json(
    createSuccessResponse(
      usuarios.length > 0 ? "Usuarios obtenidos exitosamente" : "No hay usuarios registrados",
      { usuarios },
      meta
    )
  )
})

const obtenerUsuario = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).select("-password").populate("mascotas")

  if (!usuario) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.USER_NOT_FOUND, null, 404)
    )
  }

  res.status(200).json(
    createSuccessResponse("Usuario obtenido exitosamente", { usuario })
  )
})

const actualizarUsuario = asyncHandler(async (req, res) => {
  const { password, ...datosActualizacion } = req.body

  const usuario = await Usuario.findByIdAndUpdate(req.params.id, datosActualizacion, {
    new: true,
    runValidators: true,
  }).select("-password")

  if (!usuario) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.USER_NOT_FOUND, null, 404)
    )
  }

  res.status(200).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.USER_UPDATED, { usuario })
  )
})

const eliminarUsuario = async (req, res) => {
  const userId = req.params.id
  const Mascota = require('../models/mascotaModel')
  const Historial = require('../models/historialModel')
  const Cita = require('../models/citaModel')

  try {
    // Verificar que el usuario existe
    const usuario = await Usuario.findById(userId)
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado',
        statusCode: 404
      })
    }

    // Obtener mascotas del usuario
    const mascotas = await Mascota.find({ id_propietario: userId })
    const mascotaIds = mascotas.map(m => m._id)
    
    let citasCanceladas = 0
    
    // Cancelar citas futuras una por una
    if (mascotaIds.length > 0) {
      const citasFuturas = await Cita.find({
        id_mascota: { $in: mascotaIds },
        fecha_hora: { $gt: new Date() },
        estado: { $in: ['Programada', 'Confirmada'] }
      })
      
      for (const cita of citasFuturas) {
        await Cita.findByIdAndUpdate(cita._id, {
          estado: 'Cancelada',
          notas: 'Cancelada automáticamente - Usuario eliminado'
        })
        citasCanceladas++
      }
      
      // Eliminar historiales médicos uno por uno
      const historiales = await Historial.find({ id_mascota: { $in: mascotaIds } })
      for (const historial of historiales) {
        await Historial.findByIdAndDelete(historial._id)
      }
      
      // Eliminar mascotas una por una
      for (const mascota of mascotas) {
        await Mascota.findByIdAndDelete(mascota._id)
      }
    }
    
    // Eliminar usuario
    await Usuario.findByIdAndDelete(userId)
    
    res.status(200).json({
      success: true,
      mensaje: 'Usuario eliminado exitosamente',
      data: {
        usuario: usuario.nombre,
        mascotasEliminadas: mascotaIds.length,
        citasCanceladas: citasCanceladas
      }
    })
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    res.status(500).json({
      success: false,
      mensaje: 'Error eliminando usuario',
      errores: [error.message],
      statusCode: 500
    })
  }
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
}
