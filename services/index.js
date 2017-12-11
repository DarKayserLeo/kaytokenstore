'use strict'

//npm install --save moment 

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

function createToken(user){
	const payload = { //en el payload hay que intentar colocar la menor informacion posible
		sub: user._id, //ESTO CAMBIARLO A UNA OPCION MAS SEGURA!
		iat: moment().unix(), //fecha de creacion del token
		exp: moment().add(14, 'days').unix(), //en que momento va a expirar, para ello instalamos momentjs, ayuda bastante en el manejo de fechas en javascript
	}
	//ahora lo codificamos
	return jwt.encode(payload, config.SECRET_TOKEN)
}

function decodeToken(token){
	const decoded = new Promise((resolve, reject) => {
		try{
			const payload = jwt.decode(token, config.SECRET_TOKEN)

			if(payload.exp <= moment.unix()){
				reject({
					status: 401,
					message: 'El token ha expirado'
				})
			} 

			resolve(payload.sub)

		} catch (err){
			reject({
				status: 500,
				message: "Invalid Token"	
			})
		}
	})

	return decoded  
}

module.exports = {
	createToken,
	decodeToken
}
