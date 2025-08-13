const mongoose = require('mongoose')

// Función específica para crear usuario con mascota (sin transacciones)
const createUserWithPet = async (userData, petData) => {
  const Usuario = require('../models/usuarioModel')
  const Mascota = require('../models/mascotaModel')
  const Historial = require('../models/historialModel')
  
  try {
    // 1. Crear usuario
    const usuario = new Usuario(userData)
    await usuario.save()
    
    // 2. Crear historial médico para la mascota
    const historial = new Historial({
      id_mascota: null, // Se asignará después
      vacunas: [],
      alergias: [],
      cirugias: [],
      enfermedades_cronicas: [],
      medicamentos_actuales: [],
      notas_generales: 'Historial médico creado automáticamente'
    })
    await historial.save()
    
    // 3. Crear mascota con referencia al historial
    const mascota = new Mascota({
      ...petData,
      id_propietario: usuario._id,
      historial_medico: historial._id
    })
    await mascota.save()
    
    // 4. Actualizar historial con ID de mascota
    historial.id_mascota = mascota._id
    await historial.save()
    
    // 5. Agregar mascota al usuario
    usuario.mascotas.push(mascota._id)
    await usuario.save()
    
    return {
      usuario: usuario.toObject(),
      mascota: mascota.toObject(),
      historial: historial.toObject()
    }
  } catch (error) {
    console.error('Error en createUserWithPet:', error)
    throw error
  }
}

// Función para transferir mascota entre usuarios (sin transacciones)
const transferPet = async (petId, fromUserId, toUserId) => {
  const Usuario = require('../models/usuarioModel')
  const Mascota = require('../models/mascotaModel')
  
  try {
    // 1. Verificar que la mascota existe y pertenece al usuario origen
    const mascota = await Mascota.findOne({ 
      _id: petId, 
      id_propietario: fromUserId 
    })
    
    if (!mascota) {
      throw new Error('Mascota no encontrada o no pertenece al usuario')
    }
    
    // 2. Verificar que el usuario destino existe
    const usuarioDestino = await Usuario.findById(toUserId)
    if (!usuarioDestino) {
      throw new Error('Usuario destino no encontrado')
    }
    
    // 3. Remover mascota del usuario origen
    await Usuario.findByIdAndUpdate(
      fromUserId,
      { $pull: { mascotas: petId } }
    )
    
    // 4. Agregar mascota al usuario destino
    await Usuario.findByIdAndUpdate(
      toUserId,
      { $push: { mascotas: petId } }
    )
    
    // 5. Actualizar propietario en la mascota
    mascota.id_propietario = toUserId
    await mascota.save()
    
    return {
      mascota: mascota.toObject(),
      usuarioAnterior: fromUserId,
      usuarioNuevo: toUserId
    }
  } catch (error) {
    console.error('Error en transferPet:', error)
    throw error
  }
}

// Función para eliminar usuario y todas sus mascotas
const deleteUserWithPets = async (userId) => {
  const Usuario = require('../models/usuarioModel')
  const Mascota = require('../models/mascotaModel')
  const Historial = require('../models/historialModel')
  const Cita = require('../models/citaModel')
  
  try {
    // 1. Obtener usuario
    const usuario = await Usuario.findById(userId)
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    
    // 2. Obtener mascotas del usuario
    const mascotas = await Mascota.find({ id_propietario: userId })
    const mascotaIds = mascotas.map(m => m._id)
    
    let citasCanceladas = 0
    
    // 3. Cancelar citas futuras una por una
    if (mascotaIds.length > 0) {
      const citasFuturas = await Cita.find({
        id_mascota: { $in: mascotaIds },
        fecha_hora: { $gt: new Date() },
        estado: { $in: ['Programada', 'Confirmada'] }
      })
      
      for (const cita of citasFuturas) {
        cita.estado = 'Cancelada'
        cita.notas = 'Cancelada automáticamente - Usuario eliminado'
        await cita.save()
        citasCanceladas++
      }
      
      // 4. Eliminar historiales médicos uno por uno
      const historiales = await Historial.find({ id_mascota: { $in: mascotaIds } })
      for (const historial of historiales) {
        await Historial.findByIdAndDelete(historial._id)
      }
      
      // 5. Eliminar mascotas una por una
      for (const mascota of mascotas) {
        await Mascota.findByIdAndDelete(mascota._id)
      }
    }
    
    // 6. Eliminar usuario
    await Usuario.findByIdAndDelete(userId)
    
    return {
      usuarioEliminado: usuario.toObject(),
      mascotasEliminadas: mascotaIds.length,
      citasCanceladas: citasCanceladas
    }
  } catch (error) {
    console.error('Error en deleteUserWithPets:', error)
    throw error
  }
}

// Función para crear cita con validaciones (sin transacciones)
const createAppointmentWithValidation = async (citaData) => {
  const Cita = require('../models/citaModel')
  const Mascota = require('../models/mascotaModel')
  const Usuario = require('../models/usuarioModel')
  
  try {
    // 1. Verificar que la mascota existe
    const mascota = await Mascota.findById(citaData.id_mascota)
    if (!mascota) {
      throw new Error('Mascota no encontrada')
    }
    
    // 2. Verificar que el veterinario existe y tiene el rol correcto (opcional)
    if (citaData.id_veterinario) {
      const veterinario = await Usuario.findOne({
        _id: citaData.id_veterinario,
        rol: 'veterinario'
      })
      
      if (!veterinario) {
        throw new Error('Veterinario no encontrado o no válido')
      }
      
      // 3. Verificar que no hay conflicto de horarios
      const fechaCita = new Date(citaData.fecha_hora)
      const inicioVentana = new Date(fechaCita.getTime() - 30 * 60000) // 30 min antes
      const finVentana = new Date(fechaCita.getTime() + 30 * 60000) // 30 min después
      
      const citaConflicto = await Cita.findOne({
        id_veterinario: citaData.id_veterinario,
        fecha_hora: {
          $gte: inicioVentana,
          $lte: finVentana
        },
        estado: { $in: ['Programada', 'Confirmada'] }
      })
      
      if (citaConflicto) {
        throw new Error('El veterinario ya tiene una cita programada en ese horario')
      }
    }
    
    // 4. Crear la cita
    const cita = new Cita(citaData)
    await cita.save()
    
    return cita.toObject()
  } catch (error) {
    console.error('Error en createAppointmentWithValidation:', error)
    throw error
  }
}

module.exports = {
  createUserWithPet,
  transferPet,
  deleteUserWithPets,
  createAppointmentWithValidation
}