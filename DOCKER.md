# 🐳 Guía Completa de Docker para API Clínica Veterinaria

Esta guía te ayudará a configurar, ejecutar y gestionar la API de Clínica Veterinaria usando Docker.

## 📋 Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Docker Compose instalado
- Al menos 2GB de RAM disponible
- Puertos 3001, 27017 y 80 disponibles

## 🚀 Inicio Rápido

### 1. Iniciar todos los servicios
```bash
# Usando el script automático
chmod +x docker-start.sh
./docker-start.sh

# O manualmente
docker-compose up --build -d
```

### 2. Verificar que todo funcione
```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

### 3. Acceder a la aplicación
- **API REST**: http://localhost:3001
- **Documentación Swagger**: http://localhost:3001/api-docs
- **Nginx (proxy)**: http://localhost:80

## 📁 Estructura de Archivos Docker

```
API-REST-PORTAFOLIO/
├── docker-compose.yml          # Configuración principal
├── docker-compose.dev.yml      # Configuración de desarrollo
├── Dockerfile                  # Imagen de la API
├── docker-start.sh            # Script de inicio
├── docker-stop.sh             # Script de parada
├── env.docker                 # Variables de entorno
├── .dockerignore              # Archivos a ignorar
└── nginx/
    ├── nginx.conf             # Configuración de Nginx
    └── ssl/                   # Certificados SSL
```

## 🔧 Configuración Detallada

### Variables de Entorno (env.docker)

El archivo `env.docker` contiene todas las variables necesarias:

```env
# Configuración del servidor
NODE_ENV=production
PORT=3000

# Base de datos
DB=mongodb://admin:password123@mongodb:27017/clinica_veterinaria?authSource=admin

# JWT
JWT_SECRET=mi_secreto_jwt_super_seguro_2024_clinica_veterinaria_docker
JWT_EXPIRE=24h

# CORS y seguridad
CORS_ORIGIN=*
LOG_LEVEL=info
SESSION_SECRET=session_secret_clinica_veterinaria_docker

# Monitoreo y optimización
ENABLE_METRICS=false
ENABLE_COMPRESSION=true
ENABLE_HELMET=true
ENABLE_RATE_LIMIT=true
ENABLE_VALIDATION=true
ENABLE_SANITIZATION=true

# Configuración regional
TIMEZONE=America/Mexico_City
LOCALE=es-MX
```

### Docker Compose (docker-compose.yml)

```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d

  # API REST
  api:
    build: .
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB=mongodb://admin:password123@mongodb:27017/clinica_veterinaria?authSource=admin
    ports:
      - "3001:3000"
    depends_on:
      - mongodb

  # Nginx
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
```

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reconstruir y reiniciar
docker-compose up --build -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
docker-compose logs -f api
docker-compose logs -f mongodb
```

### Desarrollo

```bash
# Usar configuración de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Acceder al contenedor de la API
docker-compose exec api sh

# Acceder a MongoDB
docker-compose exec mongodb mongosh
```

### Limpieza

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también volúmenes (¡CUIDADO! Elimina la base de datos)
docker-compose down -v

# Eliminar imágenes también
docker-compose down --rmi all

# Limpiar todo
docker system prune -a
```

## 🔍 Troubleshooting

### Problema: Puerto 3001 ya está en uso
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :3001

# Cambiar puerto en docker-compose.yml
ports:
  - "3002:3000"  # Cambiar 3001 por 3002
```

### Problema: MongoDB no se conecta
```bash
# Verificar logs de MongoDB
docker-compose logs mongodb

# Reiniciar solo MongoDB
docker-compose restart mongodb

# Verificar conectividad
docker-compose exec api ping mongodb
```

### Problema: API no responde
```bash
# Verificar logs de la API
docker-compose logs api

# Verificar variables de entorno
docker-compose exec api env | grep DB

# Reiniciar la API
docker-compose restart api
```

### Problema: Nginx no funciona
```bash
# Verificar logs de Nginx
docker-compose logs nginx

# Verificar configuración
docker-compose exec nginx nginx -t

# Reiniciar Nginx
docker-compose restart nginx
```

## 📊 Monitoreo

### Ver uso de recursos
```bash
# Ver estadísticas de contenedores
docker stats

# Ver uso de disco
docker system df
```

### Logs estructurados
```bash
# Ver logs con timestamps
docker-compose logs -f --timestamps

# Ver logs de los últimos 100 eventos
docker-compose logs --tail=100
```

## 🔒 Seguridad

### Variables de entorno sensibles
- Nunca subas `env.docker` al repositorio
- Usa secretos de Docker en producción
- Cambia las contraseñas por defecto

### Redes Docker
```bash
# Ver redes
docker network ls

# Inspeccionar red
docker network inspect clinica_network
```

## 🚀 Producción

### Configuración para producción
```bash
# Usar variables de entorno de producción
export NODE_ENV=production
export JWT_SECRET=tu_secreto_super_seguro_produccion

# Iniciar con configuración de producción
docker-compose -f docker-compose.yml up -d
```

### Backup de base de datos
```bash
# Crear backup
docker-compose exec mongodb mongodump --out /backup

# Restaurar backup
docker-compose exec mongodb mongorestore /backup
```

## 📝 Notas Importantes

1. **Puertos**: La API corre en el puerto 3001, no en 3000
2. **Base de datos**: Se crea automáticamente al iniciar
3. **Usuario admin**: Se crea automáticamente (admin@clinica.com / admin123456)
4. **Logs**: Se guardan en el directorio `logs/`
5. **Volúmenes**: Los datos de MongoDB persisten entre reinicios

## 🆘 Soporte

Si tienes problemas:

1. Verifica los logs: `docker-compose logs -f`
2. Reconstruye los contenedores: `docker-compose up --build -d`
3. Limpia todo y vuelve a empezar: `docker-compose down -v && docker-compose up --build -d`
4. Verifica que Docker esté ejecutándose
5. Verifica que los puertos estén disponibles 