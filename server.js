//npm i express -S
//npm i -S body-parser
//npm i -D nodemon
//npm i -S mongoose
//npm install --save express-fileupload
//npm install file-system --save
//npm install jsonwebtoken --save 
//npm install express-jwt --save
//npm install cookie-parser --save
//npm install --save js-cookie-remove-all //quitar esta no sirve
//npm install express-session --save
//npm install connect-mongodb-session --save

'use strict'

const http = require('http');
const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
var server  = require('http').createServer(app);

//para la conexion a la base de datos
mongoose.connect(config.db, (err, res)=>{
	if(err) {
		return console.log(`Error al conectar a la base de datos: ${err}`);
	}
	console.log('Conexión a la base de datos establecida');

	server.listen(config.port, () =>{
		console.log(`API REST corriendo en http://localhost:${config.port}`);
	});
	/*
	http.createServer(app).listen(config.port, ()=>{
		console.log(`API REST corriendo en http://localhost:${config.port}`);
	});
	*/
	/*
	app.listen(config.port, () =>{
		console.log(`API REST corriendo en http://localhost:${config.port}`);
	});
	*/
});

/*
app.listen(port, () =>{
	console.log(`API REST corriendo en http://localhost:${port}`);
});
*/
//Robo 3T
//para correr mongodb => mongod --port 27017 --dbpath C:\MongoDB\data\db
//cd Program Files\MongoDB\Server\3.6\bin
//mongod.exe --port 27017 --dbpath D:\Website\MongoDB\data\db