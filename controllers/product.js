'use strict'

const Product = require('../models/product');
const jwt = require('jsonwebtoken')
const path = require('path');
const fs = require('fs');
const appDir = path.dirname(require.main.filename);

const Cart = require('../lib/Cart');
const Security = require('../lib/Security');

function getProduct(req, res){
	let productId = req.params.productId;

	Product.findById(productId, (err, product) => {
		if(err) return res.status(500).send({message: `Error al realizar la petición $(err)`})
		if(!product) return res.status(404).send({message: `El producto no existe`})

		res.status(200).send({product: product })	
	})
}

function getProductByTag(req, res){
	let tag = req.params.productId;
	Product.find({'tag': tag}, (err, product) => {
		if(err) return res.status(500).send({message: `Error al realizar la petición $(err)`})
		if(!product) return res.status(404).send({message: `El producto no existe`})

		res.render('product_details', {
			productId: req.params.productId,
		}); 	
	})
}

function getProducts(req, res){
	Product.find({}, (err, products) => {
		if(err) return res.status(500).send({message: `Error al realizar la petición $(err)`})
		if(!products) return res.status(404).send({message: `No existen productos`})
	
		res.status(200).send({products})	
	});
	
}

function getLastProducts(req, res){ //esto lo estoy llamando directo en el index 
	let cutoff = new Date();
	cutoff.setDate(cutoff.getDate()-7);
	console.log(cutoff)
	Product.find({'created': {$gte: cutoff}}, (err, products) =>{ 
		res.status(200).send({products})
		//res.render('index', {new_products}); 	
	});
}


//la siguiente query me base en https://stackoverflow.com/questions/38365414/how-to-find-similarity-in-document-field-mongodb

function searchProduct(req, res){
	var searchText = req.query.search;
	Product.find({$text: {$search: searchText}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).exec((err, products) => {
		var rc = req.headers.cookie
		if(rc){
			var cookies = rc.split(';')
			for(var i = 0; i < cookies.length; i++){
				var cookie = cookies[i].trim() 
				var parts = cookie.split('=')
				if(parts[0].localeCompare('auth') == 0){ //si es la cookie auth entra, auth es el token
					var token = parts[1]

					return new Promise(function (resolve, reject) {
						jwt.verify(token, 'stardust_dragon', function(err, decoded){
							if(err){
								res.render('products', {products, searchText})			
							}else{
								var username = decoded.username
								res.render('products', {products, searchText, username})		
							}
						});
					})
				}
			}
		}
		//res.status(200).send({products})
		let session = req.session
		let cart = (typeof session.cart !== 'undefined') ? session.cart : false;
		res.render('products', {products, searchText, nonce: Security.md5(req.sessionID + req.headers['user-agent']), cart: cart});
	});
}

function saveProduct(req, res){
	//console.log(req.files);
	if (!req.files)
    	return res.status(400).send('No files were uploaded.');
	//console.log(req.body);

	let product = new Product();
	product.name = req.body.name;
	product.price = req.body.price;
	product.stock = req.body.stock;
	product.condition = req.body.condition;
	product.language = req.body.language;
	product.code = req.body.code;
	product.description = req.body.description;
	var code = product.code;
	code = code.toLowerCase();
	code = code.replace(/ /g, '-');
	var name = product.name;
	name = name.toLowerCase();
	name = name.replace(/ /g, '-');

	var rarity = req.body.rarity;
	var cardType = req.body.cardtype; 
	if(cardType.localeCompare("MONSTER") == 0){
		var subtype = req.body.subtype;
		var specialKey = 'level'
		var specialValue = 0;
		if(subtype.localeCompare("LINK_MONSTER") == 0){
			specialKey = 'link_rating';
			specialValue = req.body.link_rating;
		} else if(subtype.localeCompare("XYZ_MONSTER") == 0){
			specialKey = 'rank';
			specialValue = req.body.rank;
		} else{
			specialValue = req.body.level;
		}
		product.additional = {
			'card_type' : req.body.cardtype,
			'attribute' : req.body.attribute,
			'type' : req.body.type,
			'subtype' : subtype,
			'ability' : req.body.ability, 
			'rarity' : rarity,
			[specialKey] : specialValue,
			'edition' : req.body.edition,
			'atk' : req.body.atk
		}	

		if(subtype.localeCompare("LINK_MONSTER") != 0){
			product.additional['def'] = req.body.def
		}

		if(subtype.localeCompare("PENDULUM_MONSTER") == 0){
			product.additional['scale'] = req.body.scale;
			product.additional['pendulum_effect'] = req.body.pendulum_effect;
		}
		
	}else if(cardType.localeCompare("SPELL") == 0){
		product.additional = {
			'card_type' : req.body.cardtype,
			'type' : req.body.type,
			'rarity' : rarity,
			[specialKey] : specialValue,
			'edition' : req.body.edition
		}
	}else if(cardType.localeCompare("TRAP") == 0){
		product.additional = {
			'card_type' : req.body.cardtype,
			'type' : req.body.type,
			'rarity' : rarity,
			[specialKey] : specialValue,
			'edition' : req.body.edition
		}
	}
	
	rarity = rarity.toLowerCase();
	rarity = rarity.replace(/ /g, '-');
	rarity = rarity.replace('_', '-');
	product.tag = code + '-' + name + '-' + rarity;

	var s_code = product.code.split("-");
	let image = req.files.image;
	var dir = appDir + '/public/images/yugioh/' + s_code[0] + "/"

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	var imageName = req.files.image.name;
	imageName = imageName.toLowerCase();
	imageName = imageName.replace(/ /g, '-');

	image.mv(dir + imageName, function(err) {
    	if (err)
      		return res.status(500).send(err);

      	product.images.push('images/yugioh/' + s_code[0] + '/' +  imageName) 

      	product.save((err, productStored) => {
			if(err) res.status(500).send(`Error al guardar campo ${err}`);
			res.status(200).send({product: productStored})
		});
	})
}

function updateProduct(req, res){
	let productId = req.params.productId
	//para obtener los campos que deseamos actualizar debemos acceder al body de la peticion
	let update = req.body

	Product.findByIdAndUpdate(productId, update, (err, productUpdated) => {
		if(err) res.status(500).send({message: `Error al actualizar el producto ${err}`})

		res.status(200).send({product: productUpdated})
	})
}

function deleteProduct(req, res){
	let productId = req.params.productId;

	Product.findById(productId, (err, product) => {
		if(err) res.status(500).send({message: `Error al borrar el producto: ${err}`})

		product.remove(err => {
			if(err) res.status(500).send({message: `Error al borrar el producto: ${err}`})

			res.status(200).send({message: `El producto ha sido eliminado`})
		})
	})
}

//importante para exportar
module.exports = {
	getProduct,
	getProducts,
	getLastProducts,
	searchProduct,
	saveProduct,
	updateProduct,
	deleteProduct
}