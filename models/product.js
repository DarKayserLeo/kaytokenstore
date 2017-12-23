'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
	name: String,
	price: Number,
	state: String,
	language: String,
	quantity: Number,
	frontImage: String,
	backImage: String,
	tag: String
});

//para exportar el modelo
module.exports = mongoose.model('Product', ProductSchema); //de este modo desde el resto de la aplicacion se accedera a este modelo, siempre y cuando lo importemos