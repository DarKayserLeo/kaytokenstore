'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
	name: String,
	tipo: String,
	precio: Number
});

//para exportar el modelo
module.exports = mongoose.model('Product', ProductSchema); //de este modo desde el resto de la aplicacion se accedera a este modelo, siempre y cuando lo importemos