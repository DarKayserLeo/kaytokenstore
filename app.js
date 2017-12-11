'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express(); //para crear nuestro servidor, configuracion de la app
const api = require('./routes') //como el fichero dentro es index.js no hace falta incluirlo

//configuracion
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use('/api', api)

app.set('view engine', 'ejs')

app.get('/', function(req, res){
	res.render('index')
})

module.exports = app

//https://scotch.io/@PratyushB/adding-domain-registered-on-godaddy-to-heroku-app
//heroku config:get MONGODB_URI

//git push heroku master