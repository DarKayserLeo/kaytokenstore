module.exports = {
	port: process.env.PORT || 3000,
	db: process.env.MONGODB || 'mongodb://localhost:27017/admin',
	//db: process.env.MONGODB || 'mongodb://heroku_k02prnd6:os9754kttud4ddfut0l5b3j4hd@ds135966.mlab.com:35966/heroku_k02prnd6',
	SECRET_TOKEN: 'miclavedetokens' //esto es un ejemplo, deberia ser mas dificil de codificar
}