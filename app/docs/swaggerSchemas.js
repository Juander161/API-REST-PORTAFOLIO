/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *         - telefono
 *         - direccion
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *           example: "507f1f77bcf86cd799439011"
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Nombre completo del usuario
 *           example: "Juan Pérez García"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 100
 *           description: Correo electrónico único
 *           example: "test.cliente@email.com"
 *         telefono:
 *           type: string
 *           maxLength: 20
 *           description: Número de teléfono
 *           example: "+52 555 123 4567"
 *         direccion:
 *           type: string
 *           maxLength: 200
 *           description: Dirección completa
 *           example: "Av. Reforma 123, Col. Centro, CDMX"
 *         rol:
 *           type: string
 *           enum: [cliente, veterinario, recepcionista, admin]
 *           default: cliente
 *           description: Rol del usuario en el sistema
 *           example: "cliente"
 *         mascotas:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de las mascotas del usuario
 *           example: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del usuario
 *           example: "2024-01-15T10:30:00.000Z"
 * 
 *     UsuarioRegistro:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *         - telefono
 *         - direccion
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Nombre completo del usuario
 *           example: "Juan Pérez García"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 100
 *           description: Correo electrónico único
 *           example: "juan.perez@email.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 100
 *           description: Contraseña del usuario
 *           example: "TestCliente123!"
 *         telefono:
 *           type: string
 *           maxLength: 20
 *           description: Número de teléfono
 *           example: "+52 555 123 4567"
 *         direccion:
 *           type: string
 *           maxLength: 200
 *           description: Dirección completa
 *           example: "Av. Reforma 123, Col. Centro, CDMX"
 *         rol:
 *           type: string
 *           enum: [cliente, veterinario, recepcionista, admin]
 *           default: cliente
 *           description: Rol del usuario en el sistema
 *           example: "cliente"
 * 
 *     UsuarioLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "admin.test@clinica.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "admin123"
 *       example:
 *         email: "admin.test@clinica.com"
 *         password: "admin123"
 * 
 *     Mascota:
 *       type: object
 *       required:
 *         - nombre
 *         - especie
 *         - raza
 *         - fecha_nacimiento
 *         - sexo
 *         - color
 *         - id_propietario
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la mascota
 *           example: "507f1f77bcf86cd799439014"
 *         nombre:
 *           type: string
 *           maxLength: 50
 *           description: Nombre de la mascota
 *           example: "Max"
 *         especie:
 *           type: string
 *           enum: [Perro, Gato, Ave, Reptil, Roedor, Otro]
 *           description: Especie de la mascota
 *           example: "Perro"
 *         raza:
 *           type: string
 *           maxLength: 50
 *           description: Raza de la mascota
 *           example: "Golden Retriever"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento de la mascota
 *           example: "2020-05-15"
 *         sexo:
 *           type: string
 *           enum: [Macho, Hembra]
 *           description: Sexo de la mascota
 *           example: "Macho"
 *         color:
 *           type: string
 *           description: Color de la mascota
 *           example: "Dorado"
 *         foto:
 *           type: string
 *           description: URL de la foto de la mascota
 *           example: "https://ejemplo.com/fotos/max.jpg"
 *         esterilizado:
 *           type: boolean
 *           default: false
 *           description: Si la mascota está esterilizada
 *           example: true
 *         id_propietario:
 *           type: string
 *           description: ID del propietario
 *           example: "507f1f77bcf86cd799439011"
 *         historial_medico:
 *           type: string
 *           description: ID del historial médico
 *           example: "507f1f77bcf86cd799439015"
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro de la mascota
 *           example: "2024-01-15T10:30:00.000Z"
 * 
 *     Cita:
 *       type: object
 *       required:
 *         - id_mascota
 *         - id_veterinario
 *         - fecha_hora
 *         - motivo
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la cita
 *           example: "507f1f77bcf86cd799439016"
 *         id_mascota:
 *           type: string
 *           description: ID de la mascota
 *           example: "507f1f77bcf86cd799439014"
 *         id_veterinario:
 *           type: string
 *           description: ID del veterinario
 *           example: "507f1f77bcf86cd799439017"
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la cita
 *           example: "2024-02-15T14:30:00.000Z"
 *         motivo:
 *           type: string
 *           maxLength: 200
 *           description: Motivo de la cita
 *           example: "Consulta de rutina y vacunación"
 *         estado:
 *           type: string
 *           enum: [Programada, Confirmada, Completada, Cancelada]
 *           default: Programada
 *           description: Estado actual de la cita
 *           example: "Programada"
 *         notas:
 *           type: string
 *           description: Notas adicionales de la cita
 *           example: "Traer cartilla de vacunación"
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la cita
 *           example: "2024-01-15T10:30:00.000Z"
 * 
 *     HistorialMedico:
 *       type: object
 *       required:
 *         - id_mascota
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del historial
 *           example: "507f1f77bcf86cd799439015"
 *         id_mascota:
 *           type: string
 *           description: ID de la mascota
 *           example: "507f1f77bcf86cd799439014"
 *         vacunas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Rabia"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               proxima_fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *               lote:
 *                 type: string
 *                 example: "LOT123456"
 *               veterinario:
 *                 type: string
 *                 example: "Dr. García"
 *         alergias:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               sustancia:
 *                 type: string
 *                 example: "Penicilina"
 *               gravedad:
 *                 type: string
 *                 enum: [Leve, Moderada, Severa]
 *                 example: "Moderada"
 *               reaccion:
 *                 type: string
 *                 example: "Erupciones cutáneas"
 *         cirugias:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Esterilización"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-15"
 *               veterinario:
 *                 type: string
 *                 example: "Dr. López"
 *               descripcion:
 *                 type: string
 *                 example: "Ovariohisterectomía rutinaria"
 *               complicaciones:
 *                 type: string
 *                 example: "Ninguna"
 *         enfermedades_cronicas:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Diabetes", "Artritis"]
 *         medicamentos_actuales:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Insulina"
 *               dosis:
 *                 type: string
 *                 example: "5 UI"
 *               frecuencia:
 *                 type: string
 *                 example: "Cada 12 horas"
 *         notas_generales:
 *           type: string
 *           description: Notas generales del historial
 *           example: "Mascota muy activa, responde bien al tratamiento"
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del historial
 *           example: "2024-01-15T10:30:00.000Z"
 * 
 *     RespuestaExito:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         mensaje:
 *           type: string
 *           example: "Operación exitosa"
 *         data:
 *           type: object
 *           description: Datos de respuesta
 *         meta:
 *           type: object
 *           description: Metadatos adicionales
 *           properties:
 *             total:
 *               type: number
 *               example: 25
 *             page:
 *               type: number
 *               example: 1
 *             limit:
 *               type: number
 *               example: 10
 * 
 *     RespuestaError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Error en la operación"
 *         statusCode:
 *           type: number
 *           example: 400
 *         errores:
 *           type: array
 *           items:
 *             type: string
 *           example: ["El email es requerido", "La contraseña debe tener al menos 6 caracteres"]
 * 
 *     RespuestaAuth:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         mensaje:
 *           type: string
 *           example: "Login exitoso"
 *         data:
 *           type: object
 *           properties:
 *             usuario:
 *               $ref: '#/components/schemas/Usuario'
 *             token:
 *               type: string
 *               description: JWT token para autenticación
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

module.exports = {}