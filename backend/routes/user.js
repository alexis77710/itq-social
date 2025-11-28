//Aquí es donde entra en acción tu middleware. 
// Vamos a decirle a Express: "Oye, para usar estas rutas, 
// primero pasa por el chequeo de seguridad".
'use strict'
// Cargar el módulo de express
var express = require('express');
// Cargar el controlador
var UserController = require('../controllers/user');
// Llamar al router de express
var api = express.Router();
// Importamos el Middleware de Autenticación
var md_auth = require('../middlewares/authenticated');
// Configuración del Multiparty (Le decimos dónde guardar las fotos)
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});



// Rutas Públicas (Cualquiera entra)
// Definimos la ruta de prueba
api.get('/home', UserController.home);
// Definimos la ruta de registro
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);


// Rutas Privadas (Necesitan Token)
// Se pone md_auth.ensureAuth como segundo parámetro
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

// RUTAS NUEVAS DE IMAGEN
// Fíjate que usamos dos middlewares: [md_auth.ensureAuth, md_upload]
// 1. Verifica token, 2. Prepara la subida
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile); // Esta suele ser pública para que otros vean tu foto

// CAMBIO: En lugar de usar :page?, creamos dos rutas separadas:
// 1. Cuando NO pasan número de página (usa la página 1 por defecto)
api.get('/users', md_auth.ensureAuth, UserController.getUsers);
// 2. Cuando SÍ pasan número de página
api.get('/users/:page', md_auth.ensureAuth, UserController.getUsers);


//exportamos la configuración
module.exports = api;