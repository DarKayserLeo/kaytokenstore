'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
	name: String,
	price: Number,
	state: String,
	language: String,
	description: String,
	stock: Number,
	code: String,
	rarity: String,
	frontImage: String,
	backImage: String,
	tag: String,
	options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
	created: { type: Date, default: Date.now }
});

//para exportar el modelo
module.exports = mongoose.model('Product', ProductSchema); //de este modo desde el resto de la aplicacion se accedera a este modelo, siempre y cuando lo importemos