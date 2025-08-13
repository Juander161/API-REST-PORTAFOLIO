#!/bin/bash

# Script de deployment para API Clínica Veterinaria
# Automatiza el proceso completo de deployment con Docker

set -e  # Salir si cualquier comando falla

echo "🚀 Iniciando deployment de API Clínica Veterinaria"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado"
    exit 1
fi

success "Docker y Docker Compose están disponibles"

# Verificar que el archivo env.docker existe
if [ ! -f "env.docker" ]; then
    error "Archivo env.docker no encontrado"
    exit 1
fi

success "Archivo de configuración env.docker encontrado"

# Detener servicios existentes
log "Deteniendo servicios existentes..."
docker-compose down 2>/dev/null || true

# Limpiar contenedores e imágenes antiguas
log "Limpiando contenedores antiguos..."
docker system prune -f

# Construir nuevas imágenes
log "Construyendo nuevas imágenes..."
docker-compose build --no-cache

success "Imágenes construidas exitosamente"

# Iniciar servicios
log "Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
log "Esperando a que los servicios se inicien..."
sleep 10

# Verificar que los contenedores están corriendo
log "Verificando estado de contenedores..."
if ! docker-compose ps | grep -q "Up"; then
    error "Los contenedores no se iniciaron correctamente"
    docker-compose logs
    exit 1
fi

success "Contenedores iniciados correctamente"

# Ejecutar pruebas
log "Ejecutando pruebas de funcionamiento..."
if node scripts/test-docker.js; then
    success "Todas las pruebas pasaron"
else
    error "Algunas pruebas fallaron"
    warning "Revisa los logs: docker-compose logs -f"
    exit 1
fi

# Mostrar información de deployment
echo ""
echo "🎉 Deployment completado exitosamente!"
echo "======================================"
echo ""
echo "📊 Información del deployment:"
echo "  • API: http://localhost:3001"
echo "  • Documentación: http://localhost:3001/api-docs"
echo "  • MongoDB: localhost:27017"
echo ""
echo "🔧 Comandos útiles:"
echo "  • Ver logs: docker-compose logs -f"
echo "  • Ver estado: docker-compose ps"
echo "  • Detener: docker-compose down"
echo "  • Reiniciar: docker-compose restart"
echo ""
echo "🔐 Credenciales por defecto:"
echo "  • Email: admin@clinica.com"
echo "  • Password: AdminSecure2024!"
echo ""

success "¡API lista para usar!"