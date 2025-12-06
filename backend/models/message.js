//modelo de MENSAJES privados entre usuarios. ✉️


'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    emitter: { type: Schema.ObjectId, ref: 'User' }, // El que envía
    receiver: { type: Schema.ObjectId, ref: 'User' }, // El que recibe
    text: String,
    viewed: String, // 'true' o 'false'
    created_at: String
});

module.exports = mongoose.model('Message', MessageSchema);