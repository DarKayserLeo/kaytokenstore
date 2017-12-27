'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express(); //para crear nuestro servidor, configuracion de la app
const api = require('./routes') //como el fichero dentro es index.js no hace falta incluirlo

const Product = require('./models/product');

//configuracion
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use('/api', api)

app.set('view engine', 'ejs') //EJS
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index')
})

app.get('/product/:productId', function(req, res){
	
	let tag = req.params.productId;
	Product.findOne({'tag': tag}).populate('options', ['name', 'tag', 'frontImage']).exec(function (err, product){
		if(err) return res.status(500).send({message: `Error al realizar la petición $(err)`})
		if(!product) return res.status(404).send({message: `El producto no existe`})
		//res.status(200).send({product: product})
		res.render('product_details', {product}); 
	})
})

app.get('/darkayserleo', function(req, res){
	res.render('new_product')
})

module.exports = app

//https://scotch.io/@PratyushB/adding-domain-registered-on-godaddy-to-heroku-app
//heroku config:get MONGODB_URI

//git push heroku master