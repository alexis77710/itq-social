//backend/routes/publication.js
//rutas para el modelo de PUBLICACIONES (posts) 

'use strict'
// CARGAR MODULOS DE NODEJS
var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated'); // Importante: Solo usuarios logueados pueden postear
var multipart = require('connect-multiparty');
// OJO AQUÍ: Cambiamos la carpeta de destino
var md_upload = multipart({uploadDir: './uploads/publications'});


api.get('/probando-pub', PublicationController.probando);

// Guardar post
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);

// CAMBIO: Dividimos la ruta en dos para evitar el error del signo "?"
// 1. Sin número de página (por defecto pág 1)
api.get('/publications', md_auth.ensureAuth, PublicationController.getPublications);

// 2. Con número de página específico
api.get('/publications/:page', md_auth.ensureAuth, PublicationController.getPublications);

// RUTAS NUEVAS DE IMAGEN
api.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);


module.exports = api;