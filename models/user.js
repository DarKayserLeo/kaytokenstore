'use strict'

//npm i -S bcrypt-nodejs
//npm i -S crypto
//npm install --save jwt-simple <- para usar web tokens JWT

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt =  require('bcrypt-nodejs')//debemos encriptar la constraseña para guardarla en mongo 
const crypto = require('crypto')

const UserSchema = new Schema({
	email: {type: String, unique: true, lowercase: true},
	displayName: String,
	avatar: String,
	password: {type: String, select: false}, //select = false para evitar problemas de seguridad
	signUpDate: {type: Date, default: Date.now()}, //en el momento que se registre guardara la fecha del momento con Date.now
	lastLogin: Date
})

//antes de que se guarde ejecuta la siguiente funcion
UserSchema.pre('save', (next) => {
	let user = this
	//if(!user.isModified('password')) return next()

	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next()

		bcrypt.hash(user.password, salt, null, (err, hash)=>{
			if(err) return next(err)

			user.password = hash
			next()
		})
	})
})

UserSchema.methods.gravatar = function(){
	if(!this.email) return `https://gravatar.com/avatar/?s=2006d=retro`
	//creamos un hash md5 que es el que por defecto pone los gravatares, para ello se instala crypto	
	const md5 = crypto.createHash('md5').update(this.email).digest('hex') //lo devuelve en formato hexadecimal
	return `https://gravatar.com/avatar/${md5}?=2006d=retro`
}

module.exports = mongoose.model('User', UserSchema)