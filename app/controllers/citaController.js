const Cita = require("../models/citaModel")
const Mascota = require("../models/mascotaModel")

const obtenerCitas = async (req, res) => {
  try {
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

    if (!citas.length) {
      return res.status(204).json({
        mensaje: "No hay citas programadas",
      })
    }

    res.status(200).json({
      mensaje: "Citas obtenidas exitosamente",
      citas,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener citas",
      error: error.message,
    })
  }
}

const crearCita = async (req, res) => {
  try {
    // Verificar que la mascota existe
    const mascota = await Mascota.findById(req.body.id_mascota)
    if (!mascota) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada",
      })
    }

    // Si es cliente, solo puede crear citas para sus mascotas
    if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: "No tienes permisos para crear citas de esta mascota",
      })
    }

    const nuevaCita = new Cita(req.body)
    await nuevaCita.save()

    const citaCompleta = await Cita.findById(nuevaCita._id)
      .populate("id_mascota", "nombre especie raza")
      .populate("id_veterinario", "nombre email telefono")

    res.status(201).json({
      mensaje: "Cita programada exitosamente",
      cita: citaCompleta,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al programar cita",
      error: error.message,
    })
  }
}

const obtenerCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)
      .populate("id_mascota", "nombre especie raza")
      .populate("id_veterinario", "nombre email telefono")

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada",
      })
    }

    // Verificar permisos
    const mascota = await Mascota.findById(cita.id_mascota._id)
    if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: "No tienes permisos para ver esta cita",
      })
    }

    res.status(200).json({
      mensaje: "Cita obtenida exitosamente",
      cita,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener cita",
      error: error.message,
    })
  }
}

const actualizarCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada",
      })
    }

    // Verificar permisos
    const mascota = await Mascota.findById(cita.id_mascota)
    if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: "No tienes permisos para actualizar esta cita",
      })
    }

    const citaActualizada = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("id_mascota", "nombre especie raza")
      .populate("id_veterinario", "nombre email telefono")

    res.status(200).json({
      mensaje: "Cita actualizada exitosamente",
      cita: citaActualizada,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar cita",
      error: error.message,
    })
  }
}

const eliminarCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada",
      })
    }

    // Verificar permisos
    const mascota = await Mascota.findById(cita.id_mascota)
    if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: "No tienes permisos para eliminar esta cita",
      })
    }

    await Cita.findByIdAndDelete(req.params.id)

    res.status(200).json({
      mensaje: "Cita eliminada exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar cita",
      error: error.message,
    })
  }
}

module.exports = {
  obtenerCitas,
  crearCita,
  obtenerCita,
  actualizarCita,
  eliminarCita,
}
