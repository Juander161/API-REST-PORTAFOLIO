const Usuario = require("../models/usuarioModel")
const config = require("./configuracion")

const inicializarAdmin = async () => {
  try {
    // Verificar si existe al menos un admin
    const adminExistente = await Usuario.findOne({ rol: "admin" })
    
    if (!adminExistente) {
      console.log("🔐 No se encontró ningún usuario administrador")
      console.log("📝 Creando usuario administrador por defecto...")
      
      // Credenciales fijas para el administrador
      const adminPassword = "admin123567"
      
      // Crear usuario admin por defecto
      const adminPorDefecto = new Usuario({
        nombre: "Administrador Principal",
        email: "admin123@admin.com",
        password: adminPassword,
        telefono: "555-0123",
        direccion: "Oficina Administrativa Principal",
        rol: "admin"
      })
      
      await adminPorDefecto.save()
      
      console.log("✅ Usuario administrador creado exitosamente")
      console.log("📧 Email: admin123@admin.com")
      console.log(`🔑 Password: ${adminPassword}`)
      console.log("✅ Credenciales fijas configuradas correctamente")
   
    } else {
      console.log("✅ Usuario administrador ya existe")
    }
  } catch (error) {
    console.error("Error al inicializar administrador:", error.message)
  }
}

module.exports = inicializarAdmin