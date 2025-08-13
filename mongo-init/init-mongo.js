// Script de inicialización para MongoDB
// Este script se ejecuta automáticamente cuando se inicia el contenedor de MongoDB

// Crear la base de datos y usuario
db = db.getSiblingDB('clinica_veterinaria');

// Crear usuario para la aplicación (coincide con docker-compose.yml)
db.createUser({
  user: 'admin',
  pwd: 'password123',
  roles: [
    {
      role: 'readWrite',
      db: 'clinica_veterinaria'
    },
    {
      role: 'dbAdmin',
      db: 'clinica_veterinaria'
    }
  ]
});

// Crear colecciones iniciales
db.createCollection('usuarios');
db.createCollection('mascotas');
db.createCollection('historiales');
db.createCollection('citas');
db.createCollection('logs_acceso');

print('Base de datos clinica_veterinaria inicializada correctamente');
print('Usuario admin creado con permisos de lectura/escritura y administración'); 