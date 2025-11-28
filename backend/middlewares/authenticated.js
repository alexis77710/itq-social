//este código (es el que decodifica el token para ver quién es el usuario)

//Ahora que ya sabemos generar el token, 
// necesitamos crear al "guardia" que revise ese token en las rutas privadas 
// (porque cualquiera puede registrarse, pero no cualquiera puede borrar usuarios).

'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

// Cargar variables de entorno
require('dotenv').config();
var secret = process.env.CLAVE_SECRETA;

exports.ensureAuth = function(req, res, next){
    
    // 1. Comprobamos si nos llega la cabecera de autorización
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
    }

    // Limpiamos el token por si viene con comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        // 2. Decodificamos el token
        var payload = jwt.decode(token, secret);

        // 3. Comprobamos si ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
    }catch(ex){
        return res.status(404).send({
            message: 'El token no es válido'
        });
    }

    // 4. Adjuntamos el usuario identificado a la Request
    // Esto es genial: ahora en cualquier controlador tendremos req.user disponible
    req.user = payload;

    // 5. Dejamos pasar a la acción del controlador
    next();
};