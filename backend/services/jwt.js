//Para que tu Angular sepa que el usuario está logueado, 
// el backend no solo debe decir "sí, es él", sino que debe entregarle un Token 
// (una credencial digital) que el usuario guardará.
// fabrica de tokens JWT
//Necesitamos un archivo que genere esas credenciales.

'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

// Cargar variables de entorno dotenv es para gestionar variables de entorno de forma segura
require('dotenv').config(); 

// Ahora la clave la lee del archivo oculto el .env
var secret = process.env.CLAVE_SECRETA;

exports.createToken = function(user){
    var payload = {
        sub: user._id, // ID del usuario
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), // Momento de creación
        exp: moment().add(30, 'days').unix() // Fecha de expiración (30 días)
    };

    return jwt.encode(payload, secret);
};