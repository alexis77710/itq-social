'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// CARGAR RUTAS (Las iremos creando poco a poco)
var user_routes = require('./routes/user');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message'); // rutas de mensajes privados
// var follow_routes = require('./routes/follow'); 
// ... etc

// MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CONFIGURACIÓN DE CABECERAS Y CORS (IMPORTANTE PARA ANGULAR)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// RUTAS BASE (Aquí conectaremos los microservicios)

app.use('/api', user_routes); // <--- AGREGA ESTO (todo tendrá el prefijo /api)
app.use('/api', publication_routes);
app.use('/api', message_routes);
// RUTA DE PRUEBA
app.get('/test', (req, res) => {
    res.status(200).send({
        message: 'Servidor de ITQ-Social funcionando correctamente'
    });
});

module.exports = app;