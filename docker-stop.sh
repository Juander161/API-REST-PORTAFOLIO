#!/bin/bash

echo "🛑 Deteniendo servicios de la API de Clínica Veterinaria..."
echo ""

# Detener todos los contenedores
echo "📦 Deteniendo contenedores..."
docker-compose down

echo ""
echo "✅ Servicios detenidos correctamente!"
echo ""
echo "💡 Para iniciar nuevamente:"
echo "   ./docker-start.sh"
echo ""
echo "🧹 Para limpiar completamente (eliminar volúmenes):"
echo "   docker-compose down -v" 