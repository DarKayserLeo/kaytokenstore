//las rutas de nuestra api estan en lugar diferente para un rapido acceso
'use stricts'

const express = require('express')
const ProductController = require('../controllers/product')
const UserController = require('../controllers/user')
const auth = require('../middlewares/auth')
const api = express.Router() 

api.get('/products', ProductController.getProducts);
api.get('/product/:productId', ProductController.getProduct);
api.post('/product', ProductController.saveProduct);
api.put('/product/:productId', ProductController.updateProduct); //Actualizar
api.delete('/product/:productId', ProductController.deleteProduct); //Eliminar 

api.post('/signup', UserController.signUp)
api.post('/signin', UserController.signIn)
api.get('/private', auth, (req, res) => { 
	res.status(200).send({message: 'Tienes acceso'})
})

module.exports = api


