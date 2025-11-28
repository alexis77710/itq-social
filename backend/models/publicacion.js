//PUBLICACIONES (EL MURO). 🧱
//Ahora esos usuarios tienen que decir algo. Vamos a hacer que:
//Puedan escribir un post (Texto).
//Puedan ver el muro con los posts de todos (ordenados del más nuevo al más viejo).

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' }, // OJO: Aquí 'User' debe coincidir con el nombre del modelo de usuario
    texto: String,
    file: String,
    created_at: String
});

module.exports = mongoose.model('Publication', PublicationSchema);