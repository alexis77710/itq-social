//Este código define qué datos 
// vamos a pedirle a la gente. 
// He añadido el campo bio porque queremos que puedan poner una descripción.

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: { type: String, default: 'ROLE_USER' },
    image: { type: String, default: null },
    bio: String // La descripción del perfil
});

module.exports = mongoose.model('User', UserSchema);