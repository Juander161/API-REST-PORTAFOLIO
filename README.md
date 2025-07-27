# API REST - Clínica Veterinaria Patitas Felices

API REST completa para la gestión de una clínica veterinaria con autenticación JWT, roles de usuario y documentación Swagger.

## 🚀 Características

- ✅ **Autenticación JWT** - Sistema completo de registro y login
- ✅ **Roles de Usuario** - Cliente, Veterinario, Recepcionista, Admin
- ✅ **CRUD Completo** - GET, POST, PUT, DELETE para todas las entidades
- ✅ **Documentación Swagger** - API documentada automáticamente
- ✅ **Middleware de Logging** - Registro de todas las peticiones
- ✅ **Validación de Permisos** - Control de acceso basado en roles
- ✅ **Base de Datos MongoDB** - Con Mongoose ODM

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd API-REST-PORTAFOLIO
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
PORT=3000
DB=mongodb://localhost:27017/clinica_veterinaria
JWT_SECRET=tu_secreto_jwt_super_seguro_2024
JWT_EXPIRE=24h
```

4. **Iniciar MongoDB**
Asegúrate de que MongoDB esté ejecutándose en tu sistema.

5. **Ejecutar la aplicación**
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## 📚 Endpoints de la API

### Autenticación
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil del usuario (requiere autenticación)

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios (admin/recepcionista)
- `GET /api/usuarios/:id` - Obtener usuario específico
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario (admin)

### Mascotas
- `GET /api/mascotas` - Obtener mascotas
- `POST /api/mascotas` - Crear nueva mascota
- `GET /api/mascotas/:id` - Obtener mascota específica
- `PUT /api/mascotas/:id` - Actualizar mascota
- `DELETE /api/mascotas/:id` - Eliminar mascota (admin/veterinario)

### Historiales Médicos
- `GET /api/historiales` - Obtener historiales médicos
- `POST /api/historiales` - Crear historial médico
- `GET /api/historiales/:id` - Obtener historial específico
- `PUT /api/historiales/:id` - Actualizar historial (veterinario/admin)
- `DELETE /api/historiales/:id` - Eliminar historial (admin)

### Citas
- `GET /api/citas` - Obtener citas
- `POST /api/citas` - Crear nueva cita
- `GET /api/citas/:id` - Obtener cita específica
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Eliminar cita

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 👥 Roles de Usuario

- **Cliente**: Puede gestionar sus propias mascotas y citas
- **Veterinario**: Puede ver y actualizar historiales médicos, gestionar citas
- **Recepcionista**: Puede ver usuarios y gestionar citas
- **Admin**: Acceso completo a todas las funcionalidades

## 📖 Documentación Swagger

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva en:

```
http://localhost:3000/api-docs
```

## 🗄️ Estructura de la Base de Datos

### Usuarios
- nombre, email, password, telefono, direccion, rol, mascotas[]

### Mascotas
- nombre, especie, raza, edad, peso, id_propietario, historial_medico

### Historiales Médicos
- id_mascota, fecha_consulta, sintomas, diagnostico, tratamiento, observaciones

### Citas
- id_mascota, id_veterinario, fecha_hora, motivo, estado

## 🧪 Ejemplos de Uso

### Registrar un usuario
```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456",
    "telefono": "123456789",
    "direccion": "Calle Principal 123",
    "rol": "cliente"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
```

### Crear una mascota (con token)
```bash
curl -X POST http://localhost:3000/api/mascotas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "nombre": "Luna",
    "especie": "Perro",
    "raza": "Golden Retriever",
    "edad": 3,
    "peso": 25.5
  }'
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que MongoDB esté ejecutándose
- Revisa la URL de conexión en el archivo `.env`

### Error de módulos no encontrados
- Ejecuta `npm install` para instalar todas las dependencias
- Verifica que todas las rutas de importación sean correctas

### Error de autenticación
- Verifica que el token JWT sea válido
- Asegúrate de incluir el header `Authorization: Bearer <token>`

## 📝 Notas de Desarrollo

- La aplicación utiliza Express.js como framework
- MongoDB con Mongoose para la base de datos
- JWT para autenticación
- Swagger para documentación automática
- Middleware personalizado para logging y autorización

## 👨‍💻 Autor

Juan de Dios Valero Casillas

## 📄 Licencia

ISC 