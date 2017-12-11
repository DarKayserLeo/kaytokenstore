module.exports = {
	port: process.env.PORT || 3000,
	db: process.env.MONGODB || 'mongodb://localhost:27017/admin',
	SECRET_TOKEN: 'miclavedetokens' //esto es un ejemplo, deberia ser mas dificil de codificar
}