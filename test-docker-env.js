console.log('🔍 Verificando variables de entorno en Docker...')
console.log('==============================================')

console.log('Variables críticas:')
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'UNDEFINED'}`)
console.log(`PORT: ${process.env.PORT || 'UNDEFINED'}`)
console.log(`DB: ${process.env.DB || 'UNDEFINED'}`)
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'DEFINED' : 'UNDEFINED'}`)
console.log(`JWT_EXPIRE: ${process.env.JWT_EXPIRE || 'UNDEFINED'}`)

console.log('\nTodas las variables de entorno:')
Object.keys(process.env).forEach(key => {
  if (key.includes('NODE') || key.includes('PORT') || key.includes('DB') || key.includes('JWT')) {
    console.log(`${key}: ${process.env[key]}`)
  }
})

console.log('\n==============================================')
console.log('✅ Verificación completada') 