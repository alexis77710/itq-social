// crear la función para registrar usuarios.

//OJO AL DETALLE PRO: Vamos a programar una validación 
// para que no se puedan repetir emails ni nicks. Si alguien intenta 
// registrarse con un correo que ya existe, le diremos que no. 
// Además, cifraremos la contraseña para que sea segura.

'use strict'

var bcrypt = require('bcrypt-nodejs'); // Para cifrar contraseñas
var User = require('../models/user'); // Importamos el modelo que acabamos de crear
var jwt = require('../services/jwt'); // Importamos el servicio de JWT que es la fábrica de tokens
var fs = require('fs');    // Para borrar archivos
var path = require('path'); // Para acceder a rutas de carpetas


// Función de prueba
function home(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde el servidor de NodeJS'
    });
}

// Función de Registro (Sign Up)
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password) {
        
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        user.bio = params.bio; // Opcional

        // Controlar usuarios duplicados
        User.find({ $or: [
                {email: user.email.toLowerCase()},
                {nick: user.nick.toLowerCase()}
        ]}).then((users) => {
            
            if (users && users.length > 0) {
                return res.status(200).send({message: 'El usuario que intentas registrar ya existe'});
            } else {
                // Cifra la contraseña y guarda los datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save()
                        .then((userStored) => {
                            if (userStored) {
                                res.status(200).send({user: userStored});
                            } else {
                                res.status(404).send({message: 'No se ha registrado el usuario'});
                            }
                        })
                        .catch((err) => {
                            res.status(500).send({message: 'Error al guardar el usuario'});
                        });
                });
            }
        }).catch((err) => {
            return res.status(500).send({message: 'Error en la petición de usuarios'});
        });
            
    } else {
        res.status(200).send({
            message: 'Envía todos los campos necesarios!!'
        });
    }
}

// Función de Login (Sign In)
function loginUser(req, res){
    var params = req.body; // Recibimos los datos por POST

    var email = params.email; // OJO: en el login usamos email
    var password = params.password; // La contraseña que nos pasan

    // CAMBIO IMPORTANTE: Usamos .then() porque tu Mongoose es moderno
    User.findOne({email: email})
        .then((user) => {
            // Si no encuentra al usuario
            if(!user) return res.status(404).send({message: 'El usuario no se ha podido identificar'});

            // Si lo encuentra, comparamos la contraseña
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    // Contraseña correcta
                    
                    if(params.gettoken){
                        // Devolver token jwt
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        // Devolver datos de usuario sin mostrar la contraseña
                        user.password = undefined;
                        return res.status(200).send({user});
                    }

                } else {
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
            });
        })
        .catch((err) => {
            return res.status(500).send({message: 'Error en la petición'});
        });
}
// CONSEGUIR DATOS DE UN USUARIO
function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId)
        .then((user) => {
            if(!user) return res.status(404).send({message: 'El usuario no existe'});

            // OJO: No devolvemos la contraseña ni por error
            user.password = undefined;

            return res.status(200).send({user});
        })
        .catch((err) => {
            return res.status(500).send({message: 'Error en la petición'});
        });
}

// EDICIÓN DE DATOS DE USUARIO
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    // BORRAR PROPIEDAD PASSWORD (Por seguridad, no dejamos cambiar password aquí)
    delete update.password;

    // VALIDACIÓN DE SEGURIDAD (MUY IMPORTANTE) 🛡️
    // Comprobamos si el ID del usuario logueado (req.user.sub) es el mismo que el ID que quiere editar (userId)
    // "No puedes editar el perfil de tu vecino, solo el tuyo"
    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    // Buscamos y actualizamos
    User.findByIdAndUpdate(userId, update, {new: true})
        .then((userUpdated) => {
            if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

            return res.status(200).send({user: userUpdated});
        })
        .catch((err) => {
            return res.status(500).send({message: 'Error en la petición'});
        });
}


//uploadImage: Recibe el archivo, chequea si es imagen (png, jpg, gif). Si es válida, actualiza el campo image del usuario en la BD. Si no, borra el archivo.
// SUBIR ARCHIVO DE IMAGEN/AVATAR DE USUARIO
function uploadImage(req, res){
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        console.log(file_path);
        
        // Cortar el nombre del archivo para guardarlo limpio
        var file_split = file_path.split('\\'); // En Linux/Mac sería '/'
        var file_name = file_split[2]; // [ 'uploads', 'users', 'nombre_archivo.jpg' ]

        // Cortar la extensión
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        // Comprobar si somos el dueño de la cuenta (Seguridad)
        if(userId != req.user.sub){
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
        }

        // Comprobar extensión (Solo imagenes)
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            
            // Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true})
                .then((userUpdated) => {
                    if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    
                    return res.status(200).send({user: userUpdated});
                })
                .catch((err) => {
                    return res.status(500).send({message: 'Error en la petición'});
                });

        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida');
        }

    }else{
        return res.status(200).send({message: 'No se han subido imagenes'});
    }
}

// Función auxiliar para borrar ficheros si algo sale mal (No hay que exportarla)
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
    });
}

//getImageFile: Busca la foto en la carpeta. Si existe, se la manda al navegador. Si no, manda una por defecto.
// DEVOLVER IMAGEN DE USUARIO (Para mostrarla en el perfil)
function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

// LISTAR USUARIOS PAGINADOS (Versión Manual y Segura)
function getUsers(req, res) {
    // 1. Recoger la página actual
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    
    // Convertir a número entero por si acaso
    page = parseInt(page);

    var itemsPerPage = 5;

    // 2. Contar el total de usuarios primero
    User.countDocuments({}).then((total) => {
        
        // 3. Buscar los usuarios con paginación
        // skip: Si estoy en página 2, salto los primeros 5 usuarios.
        User.find().sort('name')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .then((users) => {
                
                if (!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

                return res.status(200).send({
                    users,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            })
            .catch((err) => {
                return res.status(500).send({message: 'Error en la petición'});
            });

    }).catch((err) => {
        return res.status(500).send({message: 'Error al contar usuarios'});
    });
}



module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    updateUser,
    uploadImage,
    getImageFile,
    getUsers
}