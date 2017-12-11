'use strict'

const Product = require('../models/product');

function getProduct(req, res){
	let productId = req.params.productId;

	Product.findById(productId, (err, product) => {
		if(err) return res.status(500).send({message: `Error al realizar la petición $(err)`})
		if(!product) return res.status(404).send({message: `El producto no existe`})

		res.status(200).send({product: product })	
	})
}

function getProducts(req, res){
	Product.find({}, (err, products) => {
		if(err) return res.status(500).send({message: `Error al realizar la petición $(err)`})
		if(!products) return res.status(404).send({message: `No existen productos`})
	
		res.status(200).send({products})	
	});
	
}

function saveProduct(req, res){
	console.log(req.body);

	let product = new Product();
	product.name = req.body.name;
	product.tipo = req.body.tipo;
	product.precio = req.body.precio;

	product.save((err, productStored) => {
		if(err) res.status(500).send(`Error al guardar campo ${err}`);
		res.status(200).send({product: productStored})
	});
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
	saveProduct,
	updateProduct,
	deleteProduct
}