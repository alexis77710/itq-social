'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800; // Cambiemos al 3800 para no chocar con el otro

mongoose.Promise = global.Promise;

// Conexión a la nueva base de datos 'itq_social_db'
mongoose.connect('mongodb://localhost:27017/itq_social_db')
    .then(() => {
        console.log("conexión a la base de datos itq_social_db establecida con éxito");
        
        // Crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:3800");
        });
    })
    .catch(err => console.log(err));