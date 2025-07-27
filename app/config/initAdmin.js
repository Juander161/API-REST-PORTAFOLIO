const Usuario = require("../models/usuarioModel")
const config = require("./configuracion")

const inicializarAdmin = async () => {
  try {
    // Verificar si existe al menos un admin
    const adminExistente = await Usuario.findOne({ rol: "admin" })
    
    if (!adminExistente) {
      console.log("No se encontró ningún usuario administrador")
      console.log(" Creando usuario administrador por defecto...")
      
      // Crear usuario admin por defecto
      const adminPorDefecto = new Usuario({
        nombre: "Administrador",
        email: "admin@clinica.com",
        password: "admin123456",
        telefono: "123456789",
        direccion: "Dirección Administrativa",
        rol: "admin"
      })
      
      await adminPorDefecto.save()
      
      console.log("Usuario administrador creado exitosamente")
      console.log("Email: admin@clinica.com")
      console.log("Password: admin123456")
   
    } else {
      console.log("Usuario administrador ya existe")
    }
  } catch (error) {
    console.error("Error al inicializar administrador:", error.message)
  }
}

module.exports = inicializarAdmin 