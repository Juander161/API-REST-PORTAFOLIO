// Script de inicialización para MongoDB
// Este script se ejecuta automáticamente cuando se inicia el contenedor de MongoDB

// Crear la base de datos y usuario
db = db.getSiblingDB('clinica_veterinaria');

// Crear usuario para la aplicación
db.createUser({
  user: 'clinica_user',
  pwd: 'clinica_password',
  roles: [
    {
      role: 'readWrite',
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
print('Usuario clinica_user creado con permisos de lectura/escritura'); 