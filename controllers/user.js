//Este controlador se va a encargar del registro y autenticacion de usuarios del api rest
'use strict'

const User = require('../models/user')
const service = require('../services')
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const config = require('../config')
const jwt = require('jsonwebtoken')

function signUp(req, res){
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	})

	//var secret_key = uuidv4();

	const encrypted = crypto.createHmac('sha1', config.SECRET_KEY)
                      .update(user.password)
                      .digest('base64')

    user.password = encrypted

    //return promise
    user.save((err) => {
		if(err) {
			res.render('register')
			//return res.status(500).send({message: `Error al crear el usuario ${err}`})
		}else{
			res.render('login')
		}
		//return res.status(201).send({token: service.createToken(user)})
	})
}

function signIn(req, res){
	const {username, password} = req.body
	const secret = req.app.get('jwt-secret')

	User.findOne({username: username}, function(err, user){
        if(err) {
          console.log(err);
        }
        var message;
        if(user) {
          	console.log(user)
            message = "user exists";
            console.log(message)

            //var secret_key = uuidv4();
            const encrypted = crypto.createHmac('sha1', config.SECRET_KEY)
                      .update(password)
                      .digest('base64')

		    if(user.password === encrypted){ //si coinciden las password
		    	var token = jwt.sign({ email: user.email, username: user.username, _id: user._id}, config.SECRET_TOKEN);
		    	res.cookie('auth', token);
		    	//res.send("logged in")
		    	res.redirect('/')
		    }else{
		    	message= "Contraseña inválida";
		    	res.render('login', {message})
		    }

        } else {
            message= "El usuario no existe";
            res.render('login', {message})
        }
        //res.json({message: message});
    });

}


/*
function signUp(req, res){
	const user = new User({
		email: req.body.email,
		displayName: req.body.displayName,
		password: req.body.password
	})

	user.save((err) => {
		if(err) return res.status(500).send({message: `Error al crear el usuario ${err}`})

		return res.status(201).send({token: service.createToken(user)})
	})
}

function signIn(req, res){
	User.find({email: req.body.email}, (err, user) =>{
		if (err) return res.status(500).send({message: err})
		if (!user) return res.status(404).send({message: "No existe el usuario"})
		
		req.user = user;
		res.status(200).send({
			message: "Te has logueado correctamente",
			token: service.createToken(user)
		})

	})
}
*/

module.exports = {
	signUp,
	signIn
}

