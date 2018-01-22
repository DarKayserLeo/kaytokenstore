'use strict'

const config = require('./config')

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const app = express(); //para crear nuestro servidor, configuracion de la app
const api = require('./routes') //como el fichero dentro es index.js no hace falta incluirlo

const Product = require('./models/product');
const ProductController = require('./controllers/product')

const User = require('./models/user');
const UserController = require('./controllers/user')

const Cart = require('./lib/Cart');
const Security = require('./lib/Security');

//configuracion
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use('/api', api)
app.use(cookieParser())

app.set('view engine', 'ejs') //EJS
app.use(express.static(__dirname + '/public'));

let store = new MongoStore({
    uri: config.db,
    collection: 'sessions'
});

app.use(session({
  secret: 'secret session key',
  resave: false,
  saveUninitialized: true,
  store: store,
  unset: 'destroy',
  name: 'session cookie name'
}));

app.get('/', function(req, res){ //este es el render de mi index 
	//por lo visto todo anidado 
	let cutoff = new Date(); 
	cutoff.setDate(cutoff.getDate()-7);
	//console.log(cutoff)
	Product.find({'created': {$gte: cutoff}}).limit(20).exec(function(err, new_products){
		//res.status(200).send({new_products})
		//res.render('index', {new_products});

		//si esta logeado
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
								res.render('index', {new_products})			
							}else{
								var username = decoded.username
								res.render('index', {new_products, username})		
							}
						});
					})
				}
			}
		}
		console.log("=====================")
		console.log(req.sessionID + req.headers['user-agent'])
		console.log("=====================")
		res.render('index', {new_products, nonce: Security.md5(req.sessionID + req.headers['user-agent'])})
	});

	
})

//register
app.post('/register', UserController.signUp)


//login init 
app.post('/login', UserController.signIn)
//login end

app.get('/login', function(req, res){
	var rc = req.headers.cookie
	if(rc){
		console.log("SDSDSDDS")
		console.log("---------")
		var cookies = rc.split(';')
		for(var i = 0; i < cookies.length; i++){
			var cookie = cookies[i].trim() 
			var parts = cookie.split('=')
			if(parts[0].localeCompare('auth') == 0){ //si es la cookie auth entra, auth es el token
				var token = parts[1]
				console.log("---------")
				console.log(token)
				return new Promise(function (resolve, reject) {
					jwt.verify(token, 'stardust_dragon', function(err, decoded){
						console.log("=========")
						if(err){
							res.redirect('/login')			
						}else{
							var username = decoded.username
							res.redirect('/')		
						}
					});
				})
			}
		}
	}else{
		res.render('login')
	}
})

app.get('/register', function(req, res){
	var rc = req.headers.cookie
	if(rc){
		console.log("SDSDSDDS")
		console.log("---------")
		var cookies = rc.split(';')
		for(var i = 0; i < cookies.length; i++){
			var cookie = cookies[i].trim() 
			var parts = cookie.split('=')
			if(parts[0].localeCompare('auth') == 0){ //si es la cookie auth entra, auth es el token
				var token = parts[1]
				console.log("---------")
				console.log(token)
				return new Promise(function (resolve, reject) {
					jwt.verify(token, 'stardust_dragon', function(err, decoded){
						console.log("=========")
						if(err){
							res.redirect('/register')			
						}else{
							var username = decoded.username
							res.redirect('/')		
						}
					});
				})
			}
		}
	}else{
		res.render('register')
	}
})

app.get('/logout', function(req, res){
	res.clearCookie("auth");
	res.redirect('/')
})



app.get('/product/:productId', function(req, res){
	
	let tag = req.params.productId;
	Product.findOne({'tag': tag}).populate('options', ['name', 'tag', 'frontImage']).exec(function (err, product){
		if(err) return res.status(500).send({message: `Error al realizar la petición $(err)`})
		if(!product) return res.status(404).send({message: `El producto no existe`})
		
		//si esta logeado
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
								res.render('product_details', {product})			
							}else{
								var username = decoded.username
								res.render('product_details', {product, username})		
							}
						});
					})
				}
			}
		}
		//res.status(200).send({product: product})
		res.render('product_details', {product}); 
	})
})

app.get('/products', ProductController.searchProduct);

app.post('/cart', (req, res) => {
	let qty = parseInt(req.body.qty, 10);
    let tag = "sdy-004-summoned-skull-common";
    console.log("--> " + req.body.nonce)
    if(qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
        Product.findOne({'tag': tag}).then(product => {
            Cart.addToCart(product, qty);
            Cart.saveCart(req);
            console.log("entreee")
            res.redirect('/');
        }).catch(err => {
           res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
})

app.get('/darkayserleo', function(req, res){
	res.render('new_product')
})

module.exports = app

//https://scotch.io/@PratyushB/adding-domain-registered-on-godaddy-to-heroku-app
//heroku config:get MONGODB_URI

//git push heroku master