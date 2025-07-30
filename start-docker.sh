#!/bin/bash

echo "🐕 Iniciando API de Clínica Veterinaria con Docker..."
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p logs
mkdir -p nginx/ssl

# Verificar que el archivo env.docker existe
if [ ! -f "env.docker" ]; then
    echo "❌ Error: El archivo env.docker no existe"
    echo "   Creando archivo env.docker..."
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
    echo "✅ Archivo env.docker creado"
fi

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Limpiar imágenes anteriores (opcional)
echo "🧹 Limpiando imágenes anteriores..."
docker-compose down --rmi all

# Construir y ejecutar los contenedores
echo "🔨 Construyendo y ejecutando contenedores..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar el estado de los contenedores
echo "🔍 Verificando estado de los contenedores..."
docker-compose ps

echo ""
echo "✅ Servicios iniciados correctamente!"
echo ""
echo "🌐 URLs de acceso:"
echo "   - API: http://localhost:3000"
echo "   - Documentación Swagger: http://localhost:3000/api-docs"
echo "   - Con Nginx: http://localhost:80"
echo ""
echo "🔑 Credenciales del administrador:"
echo "   - Email: admin@clinica.com"
echo "   - Password: admin123456"
echo ""
echo "📊 Para ver los logs:"
echo "   - Todos los servicios: docker-compose logs -f"
echo "   - Solo la API: docker-compose logs -f api"
echo "   - Solo MongoDB: docker-compose logs -f mongodb"
echo ""
echo "🛑 Para detener los servicios:"
echo "   docker-compose down" 