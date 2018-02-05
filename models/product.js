'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
	name: String,
	description: String,
	images: [String],
	price: Number,
	stock: Number,
	code: String,
	condition: String,
	language: String,
	type: String,
	tag: String,
	options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
	additional: {},	
	created: { type: Date, default: Date.now },
	updated: { type: Date }
});

ProductSchema.index({tag: 'text'});

//para exportar el modelo
module.exports = mongoose.model('Product', ProductSchema); //de este modo desde el resto de la aplicacion se accedera a este modelo, siempre y cuando lo importemos