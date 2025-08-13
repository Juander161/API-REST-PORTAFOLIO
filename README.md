# 🐾 API REST - Sistema de Gestión Veterinaria

> **API REST completa para la gestión integral de una clínica veterinaria**  
> Desarrollada con Node.js, Express.js, MongoDB y arquitectura robusta de microservicios.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/API-Documented-orange.svg)](http://localhost:3001/api-docs)

---

## 📋 Tabla de Contenidos

- [🎯 Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [🐳 Deployment con Docker](#-deployment-con-docker)
- [📊 Modelos de Datos](#-modelos-de-datos)
- [🔐 Sistema de Autenticación](#-sistema-de-autenticación)
- [📡 Endpoints de la API](#-endpoints-de-la-api)
- [🛡️ Seguridad y Validaciones](#️-seguridad-y-validaciones)
- [🧪 Testing y Debugging](#-testing-y-debugging)
- [📚 Documentación Adicional](#-documentación-adicional)

---

## 🎯 Características Principales

### ✨ Funcionalidades Core
- **👥 Gestión de Usuarios**: Sistema completo de roles (Admin, Veterinario, Recepcionista, Cliente)
- **🐕 Gestión de Mascotas**: Registro completo con historial médico integrado
- **📅 Sistema de Citas**: Programación y gestión de consultas veterinarias
- **🏥 Historiales Médicos**: Registro detallado de vacunas, tratamientos y diagnósticos
- **🔐 Autenticación JWT**: Sistema seguro de tokens con roles y permisos
- **📊 API RESTful**: Endpoints completamente documentados con Swagger

### 🛡️ Características Técnicas
- **🔒 Seguridad Avanzada**: Encriptación bcrypt, sanitización NoSQL, rate limiting
- **⚡ Transacciones MongoDB**: Integridad de datos garantizada
- **🏗️ Arquitectura Modular**: Controladores, middleware y utilidades separadas
- **📝 Logging Estructurado**: Sistema de logs con recuperación automática
- **🐳 Docker Ready**: Configuración completa para contenedores
- **📖 Documentación Swagger**: API completamente documentada

---

## 🏗️ Arquitectura del Sistema

```
API-REST-PORTAFOLIO/
├── 📁 app/
│   ├── 📁 config/           # Configuración centralizada
│   │   ├── conexion.js      # Conexión a MongoDB
│   │   ├── configuracion.js # Variables y constantes
│   │   └── initAdmin.js     # Inicialización de admin
│   ├── 📁 controllers/      # Lógica de negocio
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   ├── mascotaController.js
│   │   ├── citaController.js
│   │   └── historialController.js
│   ├── 📁 middleware/       # Middleware personalizado
│   │   ├── auth.js          # Autenticación JWT
│   │   ├── validation.js    # Validaciones de entrada
│   │   ├── errorHandler.js  # Manejo de errores
│   │   └── logger.js        # Sistema de logging
│   ├── 📁 models/           # Esquemas de MongoDB
│   │   ├── usuarioModel.js
│   │   ├── mascotaModel.js
│   │   ├── citaModel.js
│   │   └── historialModel.js
│   ├── 📁 routes/           # Definición de rutas
│   │   ├── authRouter.js
│   │   ├── usuarioRouter.js
│   │   ├── mascotaRouter.js
│   │   ├── citasRouter.js
│   │   └── historialRouter.js
│   ├── 📁 utils/            # Utilidades
│   │   ├── security.js      # Funciones de seguridad
│   │   └── transactions.js  # Transacciones MongoDB
│   └── 📁 docs/             # Documentación Swagger
│       └── swaggerSchemas.js
├── 📁 scripts/              # Scripts de automatización
├── 📁 mongo-init/           # Inicialización de MongoDB
├── 📁 nginx/                # Configuración de proxy
├── 🐳 docker-compose.yml    # Orquestación de servicios
├── 🐳 Dockerfile            # Imagen de la aplicación
└── 📄 package.json          # Dependencias y scripts
```

---

## 🚀 Inicio Rápido

### 📋 Prerrequisitos
- **Node.js** 18+ 
- **MongoDB** 6.0+ (o usar Docker)
- **npm** o **yarn**

### 1️⃣ Instalación Local

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd API-REST-PORTAFOLIO

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env según tus necesidades

# Iniciar MongoDB (si no usas Docker)
# mongod --dbpath /path/to/your/db

# Iniciar el servidor
npm start
```

### 2️⃣ Verificación

```bash


# Abrir documentación Swagger
# http://localhost:3000/api-docs

# Probar endpoint básico
curl http://localhost:3000/api-docs
```

### 3️⃣ Credenciales por Defecto

Al iniciar por primera vez, se crea automáticamente:

```json
{
  "email": "admin@clinica.com",
  "password": "AdminSecure2024!",
  "rol": "admin"
}
```

---

## 🐳 Deployment con Docker

### 🚀 Inicio Rápido con Docker

```bash
# Construir, iniciar y probar todo en un comando
npm run docker:full

# O paso a paso:
npm run docker:build  # Construir contenedores
npm run docker:up     # Iniciar servicios
npm run docker:test   # Probar funcionamiento
```

### 🛠️ Comandos Docker Disponibles

```bash
npm run docker:build    # Construir contenedores (sin cache)
npm run docker:up       # Iniciar servicios en background
npm run docker:down     # Detener servicios
npm run docker:logs     # Ver logs en tiempo real
npm run docker:restart  # Reiniciar servicios
npm run docker:clean    # Limpiar contenedores y volúmenes
npm run docker:test     # Ejecutar pruebas automáticas
npm run docker:full     # Construir, iniciar y probar
```

### 🌐 URLs con Docker

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **API Principal** | http://localhost:3001 | Endpoint principal |
| **Documentación** | http://localhost:3001/api-docs | Swagger UI |
| **MongoDB** | localhost:27017 | Base de datos |

### 🔍 Verificación Docker

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs específicos
docker-compose logs api
docker-compose logs mongodb

# Acceder al contenedor de la API
docker-compose exec api sh

# Verificar variables de entorno
docker-compose exec api env
```

---

## 📊 Modelos de Datos

### 👤 Usuario
```javascript
{
  "_id": "ObjectId",
  "nombre": "String (requerido, 2-100 caracteres)",
  "email": "String (requerido, único, formato email)",
  "password": "String (requerido, hasheado con bcrypt)",
  "telefono": "String (requerido, 10-15 caracteres)",
  "direccion": "String (requerido, máximo 200 caracteres)",
  "rol": "Enum ['cliente', 'veterinario', 'recepcionista', 'admin']",
  "fecha_registro": "Date (automático)"
}
```

### 🐕 Mascota
```javascript
{
  "_id": "ObjectId",
  "nombre": "String (requerido, 1-50 caracteres)",
  "especie": "Enum ['Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Otro']",
  "raza": "String (requerido, máximo 50 caracteres)",
  "fecha_nacimiento": "Date (requerido)",
  "sexo": "Enum ['Macho', 'Hembra']",
  "color": "String (requerido)",
  "foto": "String (URL, opcional)",
  "esterilizado": "Boolean (default: false)",
  "id_propietario": "ObjectId (referencia a Usuario)",
  "historial_medico": "ObjectId (referencia a Historial)",
  "fecha_registro": "Date (automático)"
}
```

### 📅 Cita
```javascript
{
  "_id": "ObjectId",
  "id_mascota": "ObjectId (referencia a Mascota)",
  "id_veterinario": "ObjectId (referencia a Usuario)",
  "fecha_hora": "Date (requerido, futura)",
  "motivo": "String (requerido, máximo 200 caracteres)",
  "estado": "Enum ['Programada', 'Confirmada', 'Completada', 'Cancelada']",
  "notas": "String (opcional)",
  "fecha_creacion": "Date (automático)"
}
```

### 🏥 Historial Médico
```javascript
{
  "_id": "ObjectId",
  "id_mascota": "ObjectId (referencia a Mascota)",
  "peso": "Number (opcional)",
  "temperatura": "Number (opcional)",
  "frecuencia_cardiaca": "Number (opcional)",
  "frecuencia_respiratoria": "Number (opcional)",
  "vacunas": [{
    "nombre": "String (requerido)",
    "fecha": "Date (requerido)",
    "proxima_fecha": "Date (requerido)",
    "lote": "String (opcional)",
    "veterinario": "String (requerido)"
  }],
  "alergias": [{
    "sustancia": "String",
    "gravedad": "Enum ['Leve', 'Moderada', 'Severa']",
    "reaccion": "String"
  }],
  "enfermedades_cronicas": ["String"],
  "cirugias": [{
    "nombre": "String",
    "fecha": "Date",
    "veterinario": "String",
    "notas": "String"
  }],
  "medicamentos_actuales": [{
    "nombre": "String",
    "dosis": "String",
    "frecuencia": "String",
    "fecha_inicio": "Date"
  }],
  "notas_generales": "String",
  "fecha_creacion": "Date (automático)"
}
```

---

## 🔐 Sistema de Autenticación

### 🎭 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **👑 Admin** | • Acceso completo a todos los recursos<br>• Gestión de usuarios<br>• Eliminación de registros<br>• Configuración del sistema |
| **👨‍⚕️ Veterinario** | • Ver todas las mascotas<br>• Crear/editar historiales médicos<br>• Gestionar citas asignadas<br>• Eliminar mascotas |
| **👩‍💼 Recepcionista** | • Ver usuarios y mascotas<br>• Crear y gestionar citas<br>• Ver historiales (solo lectura) |
| **👤 Cliente** | • Ver solo sus mascotas<br>• Crear mascotas propias<br>• Ver sus citas<br>• Ver historiales de sus mascotas |

### 🔑 Autenticación JWT

```bash
# 1. Registro de usuario
POST /api/auth/registro
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "password": "password123",
  "telefono": "1234567890",
  "direccion": "Calle 123",
  "rol": "cliente"
}

# 2. Login
POST /api/auth/login
{
  "email": "juan@email.com",
  "password": "password123"
}

# Respuesta:
{
  "success": true,
  "data": {
    "usuario": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

# 3. Usar token en requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 Endpoints de la API

### 🔐 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/registro` | Registrar nuevo usuario | ❌ No |
| `POST` | `/api/auth/login` | Iniciar sesión | ❌ No |
| `GET` | `/api/auth/perfil` | Obtener perfil del usuario | ✅ Sí |

### 👥 Usuarios

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| `GET` | `/api/usuarios` | Listar usuarios (paginado) | Admin, Veterinario, Recepcionista |
| `GET` | `/api/usuarios/:id` | Obtener usuario específico | Admin, Veterinario |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario | Admin, Propio usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario | Admin |

### 🐕 Mascotas

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| `GET` | `/api/mascotas` | Listar mascotas | Todos (filtrado por rol) |
| `POST` | `/api/mascotas` | Crear nueva mascota | Todos |
| `GET` | `/api/mascotas/:id` | Obtener mascota específica | Propietario, Veterinario, Admin |
| `PUT` | `/api/mascotas/:id` | Actualizar mascota | Propietario, Veterinario, Admin |
| `DELETE` | `/api/mascotas/:id` | Eliminar mascota | Veterinario, Admin |

### 📅 Citas

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| `GET` | `/api/citas` | Listar citas | Todos (filtrado por rol) |
| `POST` | `/api/citas` | Crear nueva cita | Todos |
| `GET` | `/api/citas/:id` | Obtener cita específica | Involucrados, Veterinario, Admin |
| `PUT` | `/api/citas/:id` | Actualizar cita | Veterinario, Admin |
| `DELETE` | `/api/citas/:id` | Cancelar cita | Veterinario, Admin |

### 🏥 Historiales Médicos

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| `GET` | `/api/historiales` | Listar historiales | Veterinario, Admin |
| `POST` | `/api/historiales` | Crear historial | Veterinario, Admin |
| `GET` | `/api/historiales/:id` | Obtener historial específico | Propietario, Veterinario, Admin |
| `PUT` | `/api/historiales/:id` | Actualizar historial | Veterinario, Admin |
| `DELETE` | `/api/historiales/:id` | Eliminar historial | Admin |

---

## 🛡️ Seguridad y Validaciones

### 🔒 Medidas de Seguridad Implementadas

- **🔐 Encriptación de Contraseñas**: bcrypt con salt rounds configurables
- **🛡️ Sanitización NoSQL**: Prevención de inyecciones MongoDB
- **⏱️ Rate Limiting**: Límites de requests por IP
- **🌐 CORS Configurado**: Políticas de origen cruzado
- **🔑 JWT Seguro**: Tokens con expiración y secretos robustos
- **✅ Validación de Entrada**: Middleware de validación completo
- **📝 Logging de Seguridad**: Registro de intentos de acceso

### ✅ Validaciones por Modelo

#### Usuario
- Email único y formato válido
- Contraseña mínimo 6 caracteres
- Teléfono formato válido
- Rol dentro de valores permitidos

#### Mascota
- Nombre requerido (1-50 caracteres)
- Especie dentro de lista permitida
- Fecha de nacimiento no futura
- Propietario debe existir

#### Cita
- Fecha futura requerida
- Mascota y veterinario deben existir
- Motivo requerido (máximo 200 caracteres)

#### Historial
- Mascota debe existir
- Vacunas con fechas válidas
- Datos médicos en rangos apropiados

---

## 🧪 Testing y Debugging

### 🔍 Scripts de Prueba Disponibles

```bash
# Verificar salud del servidor
npm run health

# Monitoreo continuo
npm run health:watch

# Pruebas completas de la API
node test-api-completo.js

# Pruebas específicas
node test-guardar-datos.js    # Prueba guardado de datos
node diagnostico-api.js       # Diagnóstico completo
node test-historial.js        # Prueba historiales médicos
```

### 🐛 Debugging

```bash
# Iniciar con logs detallados
LOG_LEVEL=debug npm start

# Ver logs de Docker
npm run docker:logs

# Verificar configuración
node -e "require('dotenv').config(); console.log(process.env)"
```

### 📊 Endpoints de Prueba

```bash
# Verificar conectividad
curl -I http://localhost:3000/

# Probar documentación
curl -I http://localhost:3000/api-docs

# Login de prueba
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinica.com","password":"AdminSecure2024!"}'
```

---

## 📚 Documentación Adicional

### 📄 Archivos de Documentación

| Archivo | Descripción |
|---------|-------------|
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Resumen técnico completo del proyecto |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guía detallada de deployment |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Solución de problemas comunes |
| [QUICK_START.md](./QUICK_START.md) | Guía de inicio rápido |
| [SOLUCION_COMPLETA.md](./SOLUCION_COMPLETA.md) | Soluciones implementadas |

### 🌐 Recursos Externos

- **📖 Documentación Swagger**: http://localhost:3000/api-docs
- **📮 Colección Postman**: `postman/clinica-api.json`
- **🐳 Docker Hub**: Imagen lista para producción
- **📊 Monitoring**: Logs estructurados con recuperación

### 🔧 Configuración Avanzada

#### Variables de Entorno

```bash
# Servidor
NODE_ENV=production
PORT=3000

# Base de datos
DB=mongodb://admin:password123@localhost:27017/clinica_veterinaria?authSource=admin

# JWT
JWT_SECRET=mi_secreto_jwt_super_seguro_2024
JWT_EXPIRE=24h

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

#### Configuración de Producción

```bash
# Usar variables de entorno seguras
export JWT_SECRET=$(openssl rand -base64 32)
export DB_PASSWORD=$(openssl rand -base64 16)

# Configurar proxy reverso (nginx)
# Ver archivo nginx/nginx.conf

# Configurar SSL/TLS
# Certificados en nginx/ssl/
```

---

## 🤝 Contribución

### 📋 Guías de Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

### 🎯 Áreas de Mejora

- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar sistema de reportes
- [ ] Integrar pasarela de pagos
- [ ] Desarrollar aplicación móvil
- [ ] Implementar chat en vivo

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Desarrollado con ❤️ para la gestión veterinaria moderna**

- 📧 Email: [tu-email@ejemplo.com]
- 🌐 Portfolio: [tu-portfolio.com]
- 💼 LinkedIn: [tu-linkedin]

---

## 🙏 Agradecimientos

- **Node.js Community** por las excelentes herramientas
- **MongoDB** por la base de datos robusta
- **Express.js** por el framework web
- **Swagger** por la documentación de API
- **Docker** por la containerización

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**

[🔝 Volver al inicio](#-api-rest---sistema-de-gestión-veterinaria)

</div>