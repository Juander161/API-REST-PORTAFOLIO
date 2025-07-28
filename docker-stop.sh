#!/bin/bash

# Script de parada para la API de Clínica Veterinaria con Docker

echo "🛑 Deteniendo servicios de la API de Clínica Veterinaria..."
echo ""

# Detener y eliminar contenedores
echo "🔨 Deteniendo contenedores..."
docker-compose down

# Opcional: eliminar volúmenes (descomentar si quieres eliminar la base de datos)
# echo "🗑️ Eliminando volúmenes..."
# docker-compose down -v

# Opcional: eliminar imágenes (descomentar si quieres reconstruir desde cero)
# echo "🗑️ Eliminando imágenes..."
# docker-compose down --rmi all

echo ""
echo "✅ Servicios detenidos correctamente!"
echo ""
echo "💡 Para volver a iniciar:"
echo "   ./docker-start.sh"
echo ""
echo "💡 Para ver el estado:"
echo "   docker-compose ps" 