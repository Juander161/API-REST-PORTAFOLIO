const Cita = require("../models/citaModel")
const Mascota = require("../models/mascotaModel")
const { createSuccessResponse, createErrorResponse, asyncHandler } = require("../middleware/errorHandler")
const { createAppointmentWithValidation } = require("../utils/transactions")
const config = require("../config/configuracion")

const obtenerCitas = asyncHandler(async (req, res) => {
  const filtro = {}

  // Filtros según el rol del usuario
  if (req.usuario.rol === "cliente") {
    const mascotas = await Mascota.find({ id_propietario: req.usuario._id })
    const mascotaIds = mascotas.map((m) => m._id)
    filtro.id_mascota = { $in: mascotaIds }
  } else if (req.usuario.rol === "veterinario") {
    filtro.id_veterinario = req.usuario._id
  }

  const citas = await Cita.find(filtro)
    .populate("id_mascota", "nombre especie raza")
    .populate("id_veterinario", "nombre email telefono")
    .sort({ fecha_hora: 1 })

  const meta = {
    total: citas.length
  }

  res.status(200).json(
    createSuccessResponse(
      citas.length > 0 ? "Citas obtenidas exitosamente" : "No hay citas programadas",
      { citas },
      meta
    )
  )
})

const crearCita = asyncHandler(async (req, res) => {
  // Verificar permisos si es cliente
  if (req.usuario.rol === "cliente") {
    const mascota = await Mascota.findById(req.body.id_mascota)
    if (!mascota) {
      return res.status(404).json(
        createErrorResponse(config.ERROR_MESSAGES.MASCOTA_NOT_FOUND, null, 404)
      )
    }

    if (mascota.id_propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json(
        createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN, null, 403)
      )
    }
  }

  // Usar transacción para crear cita con validaciones
  const nuevaCita = await createAppointmentWithValidation(req.body)

  // Obtener cita completa con populate
  const citaCompleta = await Cita.findById(nuevaCita._id)
    .populate("id_mascota", "nombre especie raza")
    .populate("id_veterinario", "nombre email telefono")

  res.status(201).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.CITA_CREATED, { cita: citaCompleta })
  )
})

const obtenerCita = asyncHandler(async (req, res) => {
  const cita = await Cita.findById(req.params.id)
    .populate("id_mascota", "nombre especie raza")
    .populate("id_veterinario", "nombre email telefono")

  if (!cita) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.CITA_NOT_FOUND, null, 404)
    )
  }

  // Verificar permisos
  const mascota = await Mascota.findById(cita.id_mascota._id)
  if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
    return res.status(403).json(
      createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN, null, 403)
    )
  }

  res.status(200).json(
    createSuccessResponse("Cita obtenida exitosamente", { cita })
  )
})

const actualizarCita = asyncHandler(async (req, res) => {
  const cita = await Cita.findById(req.params.id)

  if (!cita) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.CITA_NOT_FOUND, null, 404)
    )
  }

  // Verificar permisos
  const mascota = await Mascota.findById(cita.id_mascota)
  if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
    return res.status(403).json(
      createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN, null, 403)
    )
  }

  const citaActualizada = await Cita.findByIdAndUpdate(req.params.id, req.body, { 
    new: true, 
    runValidators: true 
  })
    .populate("id_mascota", "nombre especie raza")
    .populate("id_veterinario", "nombre email telefono")

  res.status(200).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.CITA_UPDATED, { cita: citaActualizada })
  )
})

const eliminarCita = asyncHandler(async (req, res) => {
  const cita = await Cita.findById(req.params.id)

  if (!cita) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.CITA_NOT_FOUND, null, 404)
    )
  }

  // Verificar permisos
  const mascota = await Mascota.findById(cita.id_mascota)
  if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
    return res.status(403).json(
      createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN, null, 403)
    )
  }

  await Cita.findByIdAndDelete(req.params.id)

  res.status(200).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.CITA_DELETED)
  )
})

module.exports = {
  obtenerCitas,
  crearCita,
  obtenerCita,
  actualizarCita,
  eliminarCita,
}
