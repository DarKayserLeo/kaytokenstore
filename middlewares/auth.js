'use strict'

const services = require('../services')
const jwt = require('jsonwebtoken')

function isAuth(req, res, next){
	if(!req.headers.authorization)
		return res.status(403).send({message: "No tienes authorización"})

	const token = req.headers.authorization.split(' ')[1]
	
	services.decodeToken(token)
		.then(response => {
			req.user = response
			next()
		})
		.catch(response => {
			res.status(response.status)
		})
}

//otro middleware
function ensureToken(req, res, next){
	const bearerHeader = req.headers['authorization'];
	console.log(bearerHeader)
}

const authMiddleware = (req, res, next) => {
	var rc = req.headers.cookie
	var cookies = rc.split(';')

	for(var i = 0; i < cookies.length; i++){
		var cookie = cookies[i].trim() 
		var parts = cookie.split('=')
		if(parts[0].localeCompare('auth') == 0){ //si es la cookie auth entra, auth es el token
			console.log(parts[1])
			var token = parts[1]

			// token does not exist
		    if(!token) {
		        return res.status(403).json({
		            success: false,
		            message: 'not logged in'
		        })
		    }

		    // create a promise that decodes the token
		    const p = new Promise(
		        (resolve, reject) => {
		        	console.log("sssss")
		        	console.log(token)
		            jwt.verify(token, 'stardust_dragon', (err, decoded) => {
		                if(err) reject(err)
		                resolve(decoded)
		            })
		        }
		    )

		    // if it has failed to verify, it will return an error message
		    const onError = (error) => {
		        res.status(403).json({
		            success: false,
		            message: error.message
		        })
		    }

		    // process the promise
		    p.then((decoded)=>{
		        req.decoded = decoded
		        next()
		    }).catch(onError)


		}
	}

	var token
	/*
	cookies.forEach(function(cookie){
		var parts = cookie.split('=')
		if(parts[0].localeCompare('auth')){
			console.log(parts[1])
			token = parts[1]
		}
	})
	*/
    //if(!req.headers.authorization)
	//	return res.status(403).send({message: "No tienes authorización"})

    // read the token from header or url 
    //const token = req.headers['x-access-token'] || req.query.token
    //console.log(req.query.token)
    
    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}



module.exports = {
	isAuth,
	ensureToken,
	authMiddleware
}