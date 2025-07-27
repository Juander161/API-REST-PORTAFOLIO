const Mascota = require("../models/mascotaModel")
const Usuario = require("../models/usuarioModel")

const obtenerMascotas = async (req, res) => {
  try {
    const filtro = {}

    // Si es cliente, solo puede ver sus mascotas
    if (req.usuario.rol === "cliente") {
      filtro.id_propietario = req.usuario._id
    }

    const mascotas = await Mascota.find(filtro)
      .populate("id_propietario", "nombre email telefono")
      .populate("historial_medico")

    if (!mascotas.length) {
      return res.status(204).json({
        mensaje: "No hay mascotas registradas",
      })
    }

    res.status(200).json({
      mensaje: "Mascotas obtenidas exitosamente",
      mascotas,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener mascotas",
      error: error.message,
    })
  }
}

const crearMascota = async (req, res) => {
  try {
    // Si es cliente, solo puede crear mascotas para sí mismo
    if (req.usuario.rol === "cliente") {
      req.body.id_propietario = req.usuario._id
    }

    const nuevaMascota = new Mascota(req.body)
    await nuevaMascota.save()

    // Agregar mascota al array del propietario
    await Usuario.findByIdAndUpdate(req.body.id_propietario, { $push: { mascotas: nuevaMascota._id } })

    const mascotaCompleta = await Mascota.findById(nuevaMascota._id).populate("id_propietario", "nombre email telefono")

    res.status(201).json({
      mensaje: "Mascota registrada exitosamente",
      mascota: mascotaCompleta,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar mascota",
      error: error.message,
    })
  }
}

const obtenerMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id)
      .populate("id_propietario", "nombre email telefono")
      .populate("historial_medico")

    if (!mascota) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada",
      })
    }

    // Verificar permisos
    if (req.usuario.rol === "cliente" && mascota.id_propietario._id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: "No tienes permisos para ver esta mascota",
      })
    }

    res.status(200).json({
      mensaje: "Mascota obtenida exitosamente",
      mascota,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener mascota",
      error: error.message,
    })
  }
}

const actualizarMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id)

    if (!mascota) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada",
      })
    }

    // Verificar permisos
    if (req.usuario.rol === "cliente" && mascota.id_propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: "No tienes permisos para actualizar esta mascota",
      })
    }

    const mascotaActualizada = await Mascota.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("id_propietario", "nombre email telefono")

    res.status(200).json({
      mensaje: "Mascota actualizada exitosamente",
      mascota: mascotaActualizada,
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar mascota",
      error: error.message,
    })
  }
}

const eliminarMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id)

    if (!mascota) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada",
      })
    }

    // Solo admin y veterinarios pueden eliminar mascotas
    if (!["admin", "veterinario"].includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "No tienes permisos para eliminar mascotas",
      })
    }

    await Mascota.findByIdAndDelete(req.params.id)

    // Remover mascota del array del propietario
    await Usuario.findByIdAndUpdate(mascota.id_propietario, { $pull: { mascotas: mascota._id } })

    res.status(200).json({
      mensaje: "Mascota eliminada exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar mascota",
      error: error.message,
    })
  }
}

module.exports = {
  obtenerMascotas,
  crearMascota,
  obtenerMascota,
  actualizarMascota,
  eliminarMascota,
} 