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

### Opción 1: Instalación Local

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

### Opción 2: Instalación con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd API-REST-PORTAFOLIO
```

2. **Dar permisos de ejecución a los scripts**
```bash
chmod +x docker-start.sh docker-stop.sh
```

3. **Iniciar con Docker**
```bash
# Iniciar todos los servicios
./docker-start.sh

# O manualmente
docker-compose up --build -d
```

4. **Verificar que los servicios estén funcionando**
```bash
docker-compose ps
```

5. **Acceder a la aplicación**
- API: http://localhost:3000
- Documentación Swagger: http://localhost:3000/api-docs
- Con Nginx: http://localhost:80

### Usuario Administrador por Defecto
Al iniciar el servidor por primera vez, se creará automáticamente un usuario administrador con las siguientes credenciales:
- **Email**: admin@clinica.com
- **Password**: admin123456

⚠️ **IMPORTANTE**: Cambia estas credenciales después del primer login por seguridad.

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

### 🔑 Usuario Administrador por Defecto
El sistema crea automáticamente un usuario administrador al iniciar por primera vez:

```
Email: admin@clinica.com
Password: admin123456
```

**Permisos del Admin:**
- ✅ Gestionar todos los usuarios (crear, leer, actualizar, eliminar)
- ✅ Gestionar todas las mascotas
- ✅ Gestionar todos los historiales médicos
- ✅ Gestionar todas las citas
- ✅ Acceso completo a todas las funcionalidades del sistema

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

### Login como Administrador
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinica.com",
    "password": "admin123456"
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

## 🐳 Comandos Docker Útiles

### Gestión de Contenedores
```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api
docker-compose logs -f mongodb

# Reconstruir y reiniciar
docker-compose up --build -d

# Ver estado de los contenedores
docker-compose ps

# Acceder al contenedor de la API
docker-compose exec api sh

# Acceder a MongoDB
docker-compose exec mongodb mongosh
```

### Limpieza
```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también volúmenes (¡CUIDADO! Esto elimina la base de datos)
docker-compose down -v

# Eliminar imágenes también
docker-compose down --rmi all

# Limpiar todo (contenedores, imágenes, volúmenes no utilizados)
docker system prune -a
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que MongoDB esté ejecutándose
- Revisa la URL de conexión en el archivo `.env`
- En Docker: verifica que el contenedor de MongoDB esté funcionando

### Error de módulos no encontrados
- Ejecuta `npm install` para instalar todas las dependencias
- Verifica que todas las rutas de importación sean correctas
- En Docker: reconstruye la imagen con `docker-compose up --build -d`

### Error de autenticación
- Verifica que el token JWT sea válido
- Asegúrate de incluir el header `Authorization: Bearer <token>`

### Problemas con Docker
- Verifica que Docker y Docker Compose estén instalados
- Asegúrate de que los puertos 3000, 27017 y 80 estén disponibles
- Revisa los logs con `docker-compose logs -f`

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