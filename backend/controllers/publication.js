'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var Publication = require('../models/publicacion');
var User = require('../models/user');
var Follow = require('../models/follow');

// MÉTODOS DE PRUEBA
function probando(req, res){
    res.status(200).send({message: 'Hola desde el controlador de publicaciones'});
}

// 1. GUARDAR PUBLICACIÓN (Crear Post)
function savePublication(req, res){
    var params = req.body;

    if(!params.texto) return res.status(200).send({message: 'Debes enviar un texto!!'});

    var publication = new Publication();
    publication.texto = params.texto;
    publication.file = 'null';
    publication.user = req.user.sub; // ¡Magia! El usuario es el dueño del token
    publication.created_at = moment().unix();

    publication.save()
        .then((publicationStored) => {
            if(!publicationStored) return res.status(404).send({message: 'La publicación no se ha guardado'});

            return res.status(200).send({publication: publicationStored});
        })
        .catch((err) => {
            return res.status(500).send({message: 'Error al guardar la publicación'});
        });
}

// 2. LISTAR PUBLICACIONES (EL MURO - FEED)
function getPublications(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    page = parseInt(page);
    var itemsPerPage = 4; // Mostraremos 4 posts por página

    // CountDocuments cuenta cuántos posts hay en total
    Publication.countDocuments({}).then((total) => {
        
        // Find: Buscar todos
        // Sort: '-created_at' significa Orden Descendente (del más nuevo al más viejo)
        // Populate: Cambia el ID del usuario por sus datos reales (nombre, foto)
        Publication.find().sort('-created_at').populate('user')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .then((publications) => {
                if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

                return res.status(200).send({
                    total_items: total,
                    pages: Math.ceil(total/itemsPerPage),
                    page: page,
                    publications
                });
            })
            .catch((err) => {
                return res.status(500).send({message: 'Error al devolver publicaciones'});
            });

    }).catch((err) => {
        return res.status(500).send({message: 'Error al contar publicaciones'});
    });
}


// SUBIR IMAGEN A LA PUBLICACIÓN
function uploadImage(req, res){
    var publicationId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            
            // Buscar la publicación para ver si existe
            Publication.findOne({'_id': publicationId}).then((publication) => {
                if(publication.user != req.user.sub){
                    return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicación');
                }

                Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true})
                    .then((publicationUpdated) => {
                        if(!publicationUpdated) return res.status(404).send({message: 'La publicación no existe'});
                        
                        return res.status(200).send({publication: publicationUpdated});
                    })
                    .catch(err => {
                        return res.status(500).send({message: 'Error en la petición'});
                    });
            });

        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida');
        }
    }else{
        return res.status(200).send({message: 'No se han subido imagenes'});
    }
}

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
    });
}

// DEVOLVER IMAGEN DE PUBLICACIÓN
function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/'+image_file;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    uploadImage,
    getImageFile
}