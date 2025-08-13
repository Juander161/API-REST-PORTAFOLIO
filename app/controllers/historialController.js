const Historial = require("../models/historialModel")
const Mascota = require("../models/mascotaModel")
const { createSuccessResponse, createErrorResponse, asyncHandler } = require("../middleware/errorHandler")
const config = require("../config/configuracion")

const obtenerHistoriales = asyncHandler(async (req, res) => {
  const filtro = {}

  // Si es cliente, solo puede ver historiales de sus mascotas
  if (req.usuario.rol === "cliente") {
    const mascotas = await Mascota.find({ id_propietario: req.usuario._id })
    const mascotaIds = mascotas.map((m) => m._id)
    filtro.id_mascota = { $in: mascotaIds }
  }

  const historiales = await Historial.find(filtro).populate({
    path: "id_mascota",
    populate: {
      path: "id_propietario",
      select: "nombre email telefono",
    },
  })

  const meta = {
    total: historiales.length
  }

  res.status(200).json(
    createSuccessResponse(
      historiales.length > 0 ? "Historiales obtenidos exitosamente" : "No hay historiales médicos registrados",
      { historiales },
      meta
    )
  )
})

const crearHistorial = asyncHandler(async (req, res) => {
  // Verificar que la mascota existe
  const mascota = await Mascota.findById(req.body.id_mascota)
  if (!mascota) {
    return res.status(404).json(
      createErrorResponse(config.ERROR_MESSAGES.MASCOTA_NOT_FOUND, null, 404)
    )
  }

  // Verificar permisos - solo veterinarios y admin pueden crear historiales
  if (!["veterinario", "admin"].includes(req.usuario.rol)) {
    return res.status(403).json(
      createErrorResponse(config.ERROR_MESSAGES.FORBIDDEN, null, 403)
    )
  }

  // Sanitizar datos - filtrar objetos vacíos de arrays
  const sanitizedData = { ...req.body }
  
  console.log('Datos originales recibidos:', JSON.stringify(req.body, null, 2))
  
  // Sanitizar vacunas - convertir objetos vacíos a arrays vacíos y filtrar
  if (sanitizedData.vacunas) {
    if (Array.isArray(sanitizedData.vacunas)) {
      console.log('Vacunas antes del filtro:', sanitizedData.vacunas)
      sanitizedData.vacunas = sanitizedData.vacunas.filter(vacuna => {
        const isValid = vacuna.nombre && vacuna.fecha && vacuna.proxima_fecha
        console.log('Vacuna:', vacuna, 'Es válida:', isValid)
        return isValid
      })
      console.log('Vacunas después del filtro:', sanitizedData.vacunas)
    } else if (typeof sanitizedData.vacunas === 'object' && Object.keys(sanitizedData.vacunas).length === 0) {
      // Convertir objeto vacío {} a array vacío []
      console.log('Convirtiendo vacunas de objeto vacío {} a array vacío []')
      sanitizedData.vacunas = []
    }
  }
  
  // Sanitizar alergias - convertir objetos vacíos a arrays vacíos y filtrar
  if (sanitizedData.alergias) {
    if (Array.isArray(sanitizedData.alergias)) {
      console.log('Alergias antes del filtro:', sanitizedData.alergias)
      sanitizedData.alergias = sanitizedData.alergias.filter(alergia => {
        const isValid = alergia.sustancia && alergia.gravedad
        console.log('Alergia:', alergia, 'Es válida:', isValid)
        return isValid
      })
      console.log('Alergias después del filtro:', sanitizedData.alergias)
    } else if (typeof sanitizedData.alergias === 'object' && Object.keys(sanitizedData.alergias).length === 0) {
      // Convertir objeto vacío {} a array vacío []
      console.log('Convirtiendo alergias de objeto vacío {} a array vacío []')
      sanitizedData.alergias = []
    }
  }
  
  // Sanitizar cirugias - convertir objetos vacíos a arrays vacíos y filtrar
  if (sanitizedData.cirugias) {
    if (Array.isArray(sanitizedData.cirugias)) {
      sanitizedData.cirugias = sanitizedData.cirugias.filter(cirugia => {
        return cirugia.nombre && cirugia.fecha
      })
    } else if (typeof sanitizedData.cirugias === 'object' && Object.keys(sanitizedData.cirugias).length === 0) {
      sanitizedData.cirugias = []
    }
  }
  
  // Sanitizar medicamentos_actuales - convertir objetos vacíos a arrays vacíos y filtrar
  if (sanitizedData.medicamentos_actuales) {
    if (Array.isArray(sanitizedData.medicamentos_actuales)) {
      sanitizedData.medicamentos_actuales = sanitizedData.medicamentos_actuales.filter(medicamento => {
        return medicamento.nombre
      })
    } else if (typeof sanitizedData.medicamentos_actuales === 'object' && Object.keys(sanitizedData.medicamentos_actuales).length === 0) {
      sanitizedData.medicamentos_actuales = []
    }
  }
  
  console.log('Datos sanitizados finales:', JSON.stringify(sanitizedData, null, 2))

  const nuevoHistorial = new Historial(sanitizedData)
  await nuevoHistorial.save()

  // Actualizar referencia en la mascota si no existe
  if (!mascota.historial_medico) {
    await Mascota.findByIdAndUpdate(req.body.id_mascota, { historial_medico: nuevoHistorial._id })
  }

  const historialCompleto = await Historial.findById(nuevoHistorial._id).populate({
    path: "id_mascota",
    populate: {
      path: "id_propietario",
      select: "nombre email telefono",
    },
  })

  res.status(201).json(
    createSuccessResponse(config.SUCCESS_MESSAGES.HISTORIAL_CREATED, { historial: historialCompleto })
  )
})

const obtenerHistorial = async (req, res) => {
  try {
    const historial = await Historial.findById(req.params.id).populate({
      path: "id_mascota",
      populate: {
        path: "id_propietario",
        select: "nombre email telefono",
      },
    })

    if (!historial) {
      return res.status(404).json({
        mensaje: "Historial médico no encontrado",
      })
    }

    // Verificar permisos
    if (
      req.usuario.rol === "cliente" &&
      historial.id_mascota.id_propietario._id.toString() !== req.usuario._id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permisos para ver este historial",
      })
    }

    res.status(200).json({
      mensaje: "Historial médico obtenido exitosamente",
      historial,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener historial médico",
      error: error.message,
    })
  }
}

const actualizarHistorial = async (req, res) => {
  try {
    const historial = await Historial.findById(req.params.id).populate("id_mascota")

    if (!historial) {
      return res.status(404).json({
        mensaje: "Historial médico no encontrado",
      })
    }

    // Solo veterinarios y admin pueden actualizar historiales
    if (!["veterinario", "admin"].includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "No tienes permisos para actualizar historiales médicos",
      })
    }

    // Sanitizar datos - filtrar objetos vacíos de arrays
    const sanitizedData = { ...req.body }
    
    // Sanitizar vacunas - convertir objetos vacíos a arrays vacíos y filtrar
    if (sanitizedData.vacunas) {
      if (Array.isArray(sanitizedData.vacunas)) {
        sanitizedData.vacunas = sanitizedData.vacunas.filter(vacuna => {
          return vacuna.nombre && vacuna.fecha && vacuna.proxima_fecha
        })
      } else if (typeof sanitizedData.vacunas === 'object' && Object.keys(sanitizedData.vacunas).length === 0) {
        sanitizedData.vacunas = []
      }
    }
    
    // Sanitizar alergias - convertir objetos vacíos a arrays vacíos y filtrar
    if (sanitizedData.alergias) {
      if (Array.isArray(sanitizedData.alergias)) {
        sanitizedData.alergias = sanitizedData.alergias.filter(alergia => {
          return alergia.sustancia && alergia.gravedad
        })
      } else if (typeof sanitizedData.alergias === 'object' && Object.keys(sanitizedData.alergias).length === 0) {
        sanitizedData.alergias = []
      }
    }
    
    // Sanitizar cirugias - convertir objetos vacíos a arrays vacíos y filtrar
    if (sanitizedData.cirugias) {
      if (Array.isArray(sanitizedData.cirugias)) {
        sanitizedData.cirugias = sanitizedData.cirugias.filter(cirugia => {
          return cirugia.nombre && cirugia.fecha
        })
      } else if (typeof sanitizedData.cirugias === 'object' && Object.keys(sanitizedData.cirugias).length === 0) {
        sanitizedData.cirugias = []
      }
    }
    
    // Sanitizar medicamentos_actuales - convertir objetos vacíos a arrays vacíos y filtrar
    if (sanitizedData.medicamentos_actuales) {
      if (Array.isArray(sanitizedData.medicamentos_actuales)) {
        sanitizedData.medicamentos_actuales = sanitizedData.medicamentos_actuales.filter(medicamento => {
          return medicamento.nombre
        })
      } else if (typeof sanitizedData.medicamentos_actuales === 'object' && Object.keys(sanitizedData.medicamentos_actuales).length === 0) {
        sanitizedData.medicamentos_actuales = []
      }
    }

    const historialActualizado = await Historial.findByIdAndUpdate(req.params.id, sanitizedData, {
      new: true,
      runValidators: true,
    }).populate({
      path: "id_mascota",
      populate: {
        path: "id_propietario",
        select: "nombre email telefono",
      },
    })

    res.status(200).json({
      mensaje: "Historial médico actualizado exitosamente",
      historial: historialActualizado,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar historial médico",
      error: error.message,
    })
  }
}

const eliminarHistorial = async (req, res) => {
  try {
    const historial = await Historial.findById(req.params.id)

    if (!historial) {
      return res.status(404).json({
        mensaje: "Historial médico no encontrado",
      })
    }

    // Solo admin puede eliminar historiales
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje: "No tienes permisos para eliminar historiales médicos",
      })
    }

    await Historial.findByIdAndDelete(req.params.id)

    // Remover referencia de la mascota
    await Mascota.findByIdAndUpdate(historial.id_mascota, { $unset: { historial_medico: 1 } })

    res.status(200).json({
      mensaje: "Historial médico eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar historial médico",
      error: error.message,
    })
  }
}

module.exports = {
  obtenerHistoriales,
  crearHistorial,
  obtenerHistorial,
  actualizarHistorial,
  eliminarHistorial,
}
