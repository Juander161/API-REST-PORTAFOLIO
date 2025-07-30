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
echo "   - API: http://localhost:3001"
echo "   - Documentación Swagger: http://localhost:3001/api-docs"
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