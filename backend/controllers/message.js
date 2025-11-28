/*
Este es el cerebro. Vamos a programar 3 cosas:
Enviar mensaje.
Ver mensajes recibidos (Bandeja de Entrada).
Ver mensajes enviados (Bandeja de Salida).
*/

'use strict'

var moment = require('moment');
var Message = require('../models/message');

function probando(req, res){
    res.status(200).send({message: 'Hola desde los Mensajes Privados'});
}

// 1. ENVIAR MENSAJE
function saveMessage(req, res){
    var params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'Envía los datos necesarios'});

    var message = new Message();
    message.emitter = req.user.sub; // Yo envío
    message.receiver = params.receiver; // Tú recibes
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save()
        .then((messageStored) => {
            if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});
            return res.status(200).send({message: messageStored});
        })
        .catch((err) => {
            return res.status(500).send({message: 'Error en la petición'});
        });
}

// 2. VER MENSAJES RECIBIDOS (INBOX)
function getReceivedMessages(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 4;

    // Buscamos mensajes donde YO soy el RECEPTOR
    Message.countDocuments({receiver: req.user.sub}).then((total) => {
        
        Message.find({receiver: req.user.sub})
            .populate('emitter', 'name surname image nick _id') // Traer datos de quien me escribió
            .sort('-created_at')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .then((messages) => {
                if(!messages) return res.status(404).send({message: 'No hay mensajes'});

                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total/itemsPerPage),
                    messages
                });
            })
            .catch((err) => {
                return res.status(500).send({message: 'Error en la petición'});
            });
    });
}

// 3. VER MENSAJES ENVIADOS (SENT)
function getEmittedMessages(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 4;

    // Buscamos mensajes donde YO soy el EMISOR
    Message.countDocuments({emitter: req.user.sub}).then((total) => {
        
        Message.find({emitter: req.user.sub})
            .populate('receiver', 'name surname image nick _id') // Traer datos de a quién le escribí
            .sort('-created_at')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .then((messages) => {
                if(!messages) return res.status(404).send({message: 'No hay mensajes'});

                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total/itemsPerPage),
                    messages
                });
            })
            .catch((err) => {
                return res.status(500).send({message: 'Error en la petición'});
            });
    });
}

module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages
}