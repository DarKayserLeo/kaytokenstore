//npm i express -S
//npm i -S body-parser
//npm i -D nodemon
//npm i -S mongoose

'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

//para la conexion a la base de datos
mongoose.connect(config.db, (err, res)=>{
	if(err) {
		return console.log(`Error al conectar a la base de datos: ${err}`);
	}
	console.log('Conexión a la base de datos establecida');

	app.listen(config.port, () =>{
		console.log(`API REST corriendo en http://localhost:${config.port}`);
	});
});

/*
app.listen(port, () =>{
	console.log(`API REST corriendo en http://localhost:${port}`);
});
*/
//Robo 3T
//para correr mongodb => mongod --port 27017 --dbpath C:\MongoDB\data\db