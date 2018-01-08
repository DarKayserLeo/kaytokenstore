'use strict'

const Product = require('../models/product');
const path = require('path');
const fs = require('fs');
const appDir = path.dirname(require.main.filename);

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
		//res.status(200).send({products})
		res.render('products', {products, searchText});
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
	product.state = req.body.state;
	product.language = req.body.language;
	product.stock = req.body.stock;
	product.code = req.body.code;
	product.rarity = req.body.rarity;
	product.description = req.body.description;
	var code = product.code;
	code = code.toLowerCase();
	code = code.replace(/ /g, '-');
	var name = product.name;
	name = name.toLowerCase();
	name = name.replace(/ /g, '-');
	var rarity = product.rarity;
	rarity = rarity.toLowerCase();
	rarity = rarity.replace(/ /g, '-');
	product.tag = code + '-' + name + '-' + rarity;

	if(product.state == 'NEW') product.backImage = "images/yugioh/card-back.png"

	var s_code = product.code.split("-");

	let frontImage = req.files.frontImage;


	var dir = appDir + '/public/images/yugioh/' + s_code[0] + "/"

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	//product.frontImage = 'img/yugioh/' + s_code[0] + "/"

	var frontImageName = req.files.frontImage.name;
	frontImageName = frontImageName.toLowerCase();
	frontImageName = frontImageName.replace(/ /g, '-');

	frontImage.mv(dir + frontImageName, function(err) {
    	if (err)
      		return res.status(500).send(err);

      	product.frontImage = 'images/yugioh/' + s_code[0] + '/' +  frontImageName

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