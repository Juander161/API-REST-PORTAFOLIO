#!/bin/bash

# Script de comandos Docker para la API de Clínica Veterinaria

echo "🐳 Comandos Docker para API Clínica Veterinaria"
echo "=============================================="

case "$1" in
  "build")
    echo "🔨 Construyendo contenedores..."
    docker-compose build --no-cache
    ;;
  "up")
    echo "🚀 Iniciando servicios..."
    docker-compose up -d
    echo "✅ Servicios iniciados"
    echo "📖 Documentación: http://localhost:3001/api-docs"
    ;;
  "down")
    echo "🛑 Deteniendo servicios..."
    docker-compose down
    echo "✅ Servicios detenidos"
    ;;
  "logs")
    echo "📋 Mostrando logs..."
    docker-compose logs -f
    ;;
  "restart")
    echo "🔄 Reiniciando servicios..."
    docker-compose down
    docker-compose up -d
    echo "✅ Servicios reiniciados"
    ;;
  "clean")
    echo "🧹 Limpiando contenedores y volúmenes..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Limpieza completada"
    ;;
  "status")
    echo "📊 Estado de los servicios:"
    docker-compose ps
    ;;
  "shell")
    echo "🐚 Accediendo al contenedor de la API..."
    docker-compose exec api sh
    ;;
  *)
    echo "Uso: $0 {build|up|down|logs|restart|clean|status|shell}"
    echo ""
    echo "Comandos disponibles:"
    echo "  build   - Construir contenedores"
    echo "  up      - Iniciar servicios"
    echo "  down    - Detener servicios"
    echo "  logs    - Ver logs en tiempo real"
    echo "  restart - Reiniciar servicios"
    echo "  clean   - Limpiar contenedores y volúmenes"
    echo "  status  - Ver estado de servicios"
    echo "  shell   - Acceder al contenedor de la API"
    exit 1
    ;;
esac