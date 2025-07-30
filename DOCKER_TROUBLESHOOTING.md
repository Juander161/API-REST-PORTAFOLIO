# 🔧 Solución de Problemas - Docker

## ❌ Error: "The `uri` parameter to `openUri()` must be a string, got 'undefined'"

### 🔍 Diagnóstico del Problema

Este error indica que la variable de entorno `DB` (URI de conexión a MongoDB) no se está cargando correctamente en el contenedor Docker.

### ✅ Soluciones

#### Opción 1: Usar el script mejorado (Recomendado)

```bash
# Dar permisos de ejecución al script
chmod +x start-docker.sh

# Ejecutar el script de inicio
./start-docker.sh
```

#### Opción 2: Verificar variables de entorno manualmente

1. **Verificar que el archivo `env.docker` existe:**
```bash
ls -la env.docker
```

2. **Si no existe, crearlo:**
```bash
cat > env.docker << EOF
NODE_ENV=production
PORT=3000
DB=mongodb://admin:password123@mongodb:27017/clinica_veterinaria?authSource=admin
JWT_SECRET=mi_secreto_jwt_super_seguro_2024_clinica_veterinaria_docker
JWT_EXPIRE=24h
CORS_ORIGIN=*
LOG_LEVEL=info
SESSION_SECRET=session_secret_clinica_veterinaria_docker
ENABLE_METRICS=false
ENABLE_COMPRESSION=true
ENABLE_HELMET=true
ENABLE_RATE_LIMIT=true
ENABLE_VALIDATION=true
ENABLE_SANITIZATION=true
TIMEZONE=America/Mexico_City
LOCALE=es-MX
EOF
```

3. **Reconstruir y ejecutar:**
```bash
docker-compose down
docker-compose up --build -d
```

#### Opción 3: Verificar logs en tiempo real

```bash
# Ver logs de la API
docker-compose logs -f api

# Ver logs de MongoDB
docker-compose logs -f mongodb

# Ver logs de todos los servicios
docker-compose logs -f
```

### 🔧 Verificaciones Adicionales

#### 1. Verificar que MongoDB esté funcionando

```bash
# Verificar estado de contenedores
docker-compose ps

# Verificar que MongoDB esté respondiendo
docker-compose exec mongodb mongosh --eval "db.runCommand('ping')"
```

#### 2. Verificar variables de entorno en el contenedor

```bash
# Entrar al contenedor de la API
docker-compose exec api sh

# Verificar variables de entorno
env | grep -E "(NODE_ENV|PORT|DB|JWT)"

# Salir del contenedor
exit
```

#### 3. Verificar configuración de red

```bash
# Verificar redes Docker
docker network ls

# Verificar que los contenedores estén en la misma red
docker-compose exec api ping mongodb
```

### 🚀 Comandos Útiles

#### Iniciar servicios
```bash
# Inicio completo
./start-docker.sh

# O manualmente
docker-compose up --build -d
```

#### Detener servicios
```bash
docker-compose down
```

#### Reiniciar servicios
```bash
docker-compose restart
```

#### Limpiar todo
```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también volúmenes
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Limpiar todo
docker system prune -a
```

### 📊 Monitoreo

#### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo la API
docker-compose logs -f api

# Solo MongoDB
docker-compose logs -f mongodb
```

#### Verificar estado de servicios
```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats
```

### 🔍 Debugging Avanzado

#### 1. Verificar configuración de la aplicación

```bash
# Entrar al contenedor
docker-compose exec api sh

# Verificar archivo de configuración
node -e "console.log(require('./app/config/configuracion'))"

# Verificar variables de entorno
node -e "console.log(process.env.DB)"
```

#### 2. Verificar conectividad de red

```bash
# Desde el contenedor de la API
docker-compose exec api sh

# Probar conexión a MongoDB
nc -zv mongodb 27017

# O usar telnet
telnet mongodb 27017
```

#### 3. Verificar logs de MongoDB

```bash
# Ver logs de MongoDB
docker-compose logs mongodb

# Entrar a MongoDB
docker-compose exec mongodb mongosh
```

### 🆘 Si el problema persiste

1. **Verificar que Docker y Docker Compose estén actualizados**
2. **Verificar que los puertos 3000, 27017 y 80 estén disponibles**
3. **Revisar el firewall y configuraciones de red**
4. **Verificar que haya suficiente espacio en disco**
5. **Revisar la documentación oficial de Docker**

### 📞 Contacto

Si el problema persiste después de intentar todas las soluciones, por favor:

1. Ejecuta `docker-compose logs api` y comparte los logs
2. Ejecuta `docker-compose ps` y comparte el estado de los contenedores
3. Verifica que todos los archivos de configuración estén presentes

---

**Nota:** Este archivo se actualiza automáticamente con las últimas soluciones conocidas para problemas comunes de Docker. 