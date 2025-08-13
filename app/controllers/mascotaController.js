const Mascota = require("../models/mascotaModel")
const Usuario = require("../models/usuarioModel")
const { createSuccessResponse, createErrorResponse, asyncHandler } = require("../middleware/errorHandler")
const config = require("../config/configuracion")

const obtenerMascotas = asyncHandler(async (req, res) => {
  const filtro = {}

  // Si es cliente, solo puede ver sus mascotas
  if (req.usuario.rol === "cliente") {
    filtro.id_propietario = req.usuario._id
  }

  const mascotas = await Mascota.find(filtro)
    .populate("id_propietario", "nombre email telefono")
    .populate("historial_medico")

  const meta = {
    total: mascotas.length
  }

  res.status(200).json(
    createSuccessResponse(
      mascotas.length > 0 ? "Mascotas obtenidas exitosamente" : "No hay mascotas registradas",
      { mascotas },
      meta
    )
  )
})

const crearMascota = asyncHandler(async (req, res) => {
  // Si es cliente, solo puede crear mascotas para sí mismo
  if (req.usuario.rol === "cliente") {
    req.body.id_propietario = req.usuario._id
  } else {
    // Para admin/veterinario, si no se proporciona id_propietario, usar el del usuario actual
    if (!req.body.id_propietario) {
      req.body.id_propietario = req.usuario._id
    }
  }

  // Verificar que el propietario existe
  const propietario = await Usuario.findById(req.body.id_propietario)
  if (!propietario) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.USER_NOT_FOUND, null, 404)
    )
  }

  // Crear mascota sin historial médico por ahora
  const nuevaMascota = new Mascota(req.body)
  await nuevaMascota.save()

  // Agregar mascota al array del propietario
  if (!propietario.mascotas) {
    propietario.mascotas = []
  }
  propietario.mascotas.push(nuevaMascota._id)
  await propietario.save()

  // Obtener mascota completa
  const mascotaCompleta = await Mascota.findById(nuevaMascota._id)
    .populate("id_propietario", "nombre email telefono")

  res.status(201).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.MASCOTA_CREATED, { mascota: mascotaCompleta })
  )
})

const obtenerMascota = asyncHandler(async (req, res) => {
  const mascota = await Mascota.findById(req.params.id)
    .populate("id_propietario", "nombre email telefono")
    .populate("historial_medico")

  if (!mascota) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.MASCOTA_NOT_FOUND)
    )
  }

  // Verificar permisos
  if (req.usuario.rol === "cliente" && mascota.id_propietario._id.toString() !== req.usuario._id.toString()) {
    return res.status(403).json(
      createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN)
    )
  }

  res.status(200).json(
    createSuccessResponse("Mascota obtenida exitosamente", { mascota })
  )
})

const actualizarMascota = asyncHandler(async (req, res) => {
  const mascota = await Mascota.findById(req.params.id)

  if (!mascota) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.MASCOTA_NOT_FOUND)
    )
  }

  // Verificar permisos
  if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
    return res.status(403).json(
      createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN)
    )
  }

  const mascotaActualizada = await Mascota.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("id_propietario", "nombre email telefono")
    .populate("historial_medico")

  res.status(200).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.MASCOTA_UPDATED, { mascota: mascotaActualizada })
  )
})

const eliminarMascota = asyncHandler(async (req, res) => {
  const mascota = await Mascota.findById(req.params.id)

  if (!mascota) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.MASCOTA_NOT_FOUND, null, 404)
    )
  }

  // Solo admin y veterinarios pueden eliminar mascotas
  if (!["admin", "veterinario"].includes(req.usuario.rol)) {
    return res.status(403).json(
      createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN, null, 403)
    )
  }

  try {
    // 1. Eliminar historial médico si existe
    const Historial = require("../models/historialModel")
    await Historial.findOneAndDelete({ id_mascota: mascota._id })

    // 2. Eliminar mascota
    await Mascota.findByIdAndDelete(req.params.id)

    // 3. Remover mascota del array del propietario
    await Usuario.findByIdAndUpdate(
      mascota.id_propietario, 
      { $pull: { mascotas: mascota._id } }
    )

    res.status(200).json(
      createSuccessResponse(config.SUCCESS_MESSAGES.MASCOTA_DELETED)
    )

  } catch (error) {
    console.error('Error al eliminar mascota:', error)
    res.status(500).json(
      createErrorResponse("Error al eliminar mascota: " + error.message, null, 500)
    )
  }
})

module.exports = {
  obtenerMascotas,
  crearMascota,
  obtenerMascota,
  actualizarMascota,
  eliminarMascota,
}