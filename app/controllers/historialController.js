const Historial = require("../models/historialModel")
const Mascota = require("../models/mascotaModel")

const obtenerHistoriales = async (req, res) => {
  try {
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

    if (!historiales.length) {
      return res.status(204).json({
        mensaje: "No hay historiales médicos registrados",
      })
    }

    res.status(200).json({
      mensaje: "Historiales obtenidos exitosamente",
      historiales,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener historiales",
      error: error.message,
    })
  }
}

const crearHistorial = async (req, res) => {
  try {
    // Verificar que la mascota existe
    const mascota = await Mascota.findById(req.body.id_mascota)
    if (!mascota) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada",
      })
    }

    // Verificar permisos
    if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: "No tienes permisos para crear historial de esta mascota",
      })
    }

    const nuevoHistorial = new Historial(req.body)
    await nuevoHistorial.save()

    // Actualizar referencia en la mascota
    await Mascota.findByIdAndUpdate(req.body.id_mascota, { historial_medico: nuevoHistorial._id })

    const historialCompleto = await Historial.findById(nuevoHistorial._id).populate({
      path: "id_mascota",
      populate: {
        path: "id_propietario",
        select: "nombre email telefono",
      },
    })

    res.status(201).json({
      mensaje: "Historial médico creado exitosamente",
      historial: historialCompleto,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear historial médico",
      error: error.message,
    })
  }
}

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

    const historialActualizado = await Historial.findByIdAndUpdate(req.params.id, req.body, {
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
