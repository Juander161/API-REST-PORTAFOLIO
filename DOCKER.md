# 🐳 Guía de Docker para API de Clínica Veterinaria

Esta guía te ayudará a ejecutar la API de Clínica Veterinaria usando Docker.

## 📋 Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado
- Al menos 2GB de RAM disponible
- Puertos 3000, 27017 y 80 disponibles

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd API-REST-PORTAFOLIO
```

### 2. Dar permisos a los scripts
```bash
chmod +x docker-start.sh docker-stop.sh
```

### 3. Iniciar servicios
```bash
./docker-start.sh
```

### 4. Verificar que todo funcione
```bash
docker-compose ps
```

### 5. Acceder a la aplicación
- **API**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/api-docs
- **Con Nginx**: http://localhost:80

## 🔧 Comandos Útiles

### Gestión de Servicios
```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reconstruir y reiniciar
docker-compose up --build -d

# Ver estado
docker-compose ps
```

### Logs
```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs de la API
docker-compose logs -f api

# Ver logs de MongoDB
docker-compose logs -f mongodb

# Ver logs de Nginx
docker-compose logs -f nginx
```

### Desarrollo
```bash
# Iniciar en modo desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Detener modo desarrollo
docker-compose -f docker-compose.dev.yml down
```

### Acceso a Contenedores
```bash
# Acceder al contenedor de la API
docker-compose exec api sh

# Acceder a MongoDB
docker-compose exec mongodb mongosh

# Acceder a Nginx
docker-compose exec nginx sh
```

## 🗄️ Base de Datos

### Credenciales MongoDB
- **Usuario**: admin
- **Password**: password123
- **Base de datos**: clinica_veterinaria

### Acceso Directo a MongoDB
```bash
# Desde el host
mongosh mongodb://admin:password123@localhost:27017/clinica_veterinaria?authSource=admin

# Desde el contenedor
docker-compose exec mongodb mongosh
```

## 🔐 Usuario Administrador

Al iniciar por primera vez, se crea automáticamente un usuario admin:

- **Email**: admin@clinica.com
- **Password**: admin123456

## 📁 Estructura de Archivos Docker

```
├── Dockerfile                 # Configuración de la imagen de la API
├── docker-compose.yml         # Configuración de servicios (producción)
├── docker-compose.dev.yml     # Configuración de servicios (desarrollo)
├── docker-start.sh           # Script de inicio
├── docker-stop.sh            # Script de parada
├── .dockerignore             # Archivos a ignorar en Docker
├── nginx/
│   └── nginx.conf           # Configuración de Nginx
└── mongo-init/
    └── init-mongo.js        # Script de inicialización de MongoDB
```

## 🔧 Configuración

### Variables de Entorno
Las variables de entorno están configuradas en `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - DB=mongodb://admin:password123@mongodb:27017/clinica_veterinaria?authSource=admin
  - JWT_SECRET=mi_secreto_jwt_super_seguro_2024_clinica_veterinaria_docker
  - JWT_EXPIRE=24h
```

### Puertos
- **3000**: API REST
- **27017**: MongoDB
- **80**: Nginx (proxy reverso)
- **443**: Nginx (HTTPS, configurado pero no activo)

### Volúmenes
- **mongodb_data**: Datos persistentes de MongoDB
- **./logs**: Logs de la aplicación
- **./nginx/ssl**: Certificados SSL (opcional)

## 🐛 Solución de Problemas

### Error de puertos ocupados
```bash
# Verificar puertos en uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :27017
netstat -tulpn | grep :80

# Detener servicios que usen estos puertos
sudo systemctl stop nginx
sudo systemctl stop mongod
```

### Error de permisos
```bash
# Dar permisos a los scripts
chmod +x docker-start.sh docker-stop.sh

# Si hay problemas con volúmenes
sudo chown -R $USER:$USER .
```

### Error de memoria
```bash
# Verificar uso de memoria
docker stats

# Limpiar recursos no utilizados
docker system prune -a
```

### Reconstruir desde cero
```bash
# Detener y eliminar todo
docker-compose down -v --rmi all

# Limpiar Docker
docker system prune -a

# Reconstruir
docker-compose up --build -d
```

## 🔒 Seguridad

### Cambiar credenciales por defecto
1. Inicia los servicios
2. Accede a la API y cambia la contraseña del admin
3. Actualiza las variables de entorno en `docker-compose.yml`

### Configurar SSL
1. Coloca tus certificados en `nginx/ssl/`
2. Descomenta la sección HTTPS en `nginx/nginx.conf`
3. Reinicia los servicios

## 📊 Monitoreo

### Ver recursos utilizados
```bash
docker stats
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Verificar salud de los servicios
```bash
# API
curl http://localhost:3000

# MongoDB
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

## 🚀 Despliegue en Producción

### 1. Configurar variables de entorno
```bash
cp env.example .env
# Editar .env con valores de producción
```

### 2. Configurar SSL
```bash
# Colocar certificados en nginx/ssl/
# Descomentar configuración HTTPS en nginx/nginx.conf
```

### 3. Configurar backup de MongoDB
```bash
# Crear script de backup
docker-compose exec mongodb mongodump --out /backup
```

### 4. Configurar monitoreo
```bash
# Usar herramientas como Prometheus, Grafana, etc.
```

## 📝 Notas Importantes

- Los datos de MongoDB se almacenan en un volumen persistente
- Los logs se guardan en el directorio `./logs`
- El usuario admin se crea automáticamente en el primer inicio
- Nginx actúa como proxy reverso para mejor rendimiento
- Todos los servicios se reinician automáticamente si fallan 