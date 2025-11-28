//backend/routes/message.js
//rutas para el modelo de MENSAJES privados entre usuarios. ✉️

'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-md', md_auth.ensureAuth, MessageController.probando);
// Enviar mensaje
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);


// CAMBIO: Dividimos las rutas para quitar el "?"

// 1. Bandeja de Entrada (Inbox)
api.get('/my-messages', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/my-messages/:page', md_auth.ensureAuth, MessageController.getReceivedMessages);

// 2. Bandeja de Salida (Enviados)
api.get('/messages-to', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/messages-to/:page', md_auth.ensureAuth, MessageController.getEmittedMessages);

module.exports = api;