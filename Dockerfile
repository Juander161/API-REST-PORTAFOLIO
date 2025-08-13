# Usar la imagen oficial de Node.js Alpine para menor tamaño
FROM node:18-alpine

# Instalar dumb-init y wget para manejo de señales y health checks
RUN apk add --no-cache dumb-init wget

# Establecer el directorio de trabajo
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar el código de la aplicación
COPY --chown=nodejs:nodejs . .

# Crear directorio de logs
RUN mkdir -p logs && chown nodejs:nodejs logs

# Cambiar a usuario no-root
USER nodejs

# Exponer el puerto
EXPOSE 3000

# Configurar variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:docker"] 