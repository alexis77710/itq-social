Encriptación: Para que las contraseñas no se vean en texto plano (bcrypt-nodejs).

Tokens: Para el Login y seguridad (jwt-simple, moment).

Imágenes: Para subir fotos (connect-multiparty).

CORS: Para que Angular se conecte sin llorar (cors).

npm install mongoose-pagination
 sirve para la sección de "Amigos" o "Buscar", necesitamos una lista de usuarios.  si tenemos 1,000 usuarios, no puedes cargarlos todos de golpe o la app explota. Necesitamos Paginación (Página 1, Página 2, etc.). para eso es esta dependencia se instala en el backend.

PASO 2: La Estructura Profesional (El Esqueleto) 🦴
Como son "5 microservicios", el orden es vital. Crea estas carpetas dentro de backend:

📂 controllers (La lógica de tus 5 servicios)

📂 models (Tus bases de datos: Usuarios, Publicaciones, Mensajes)

📂 routes (Las URLs de tu API)

📂 middlewares (Aquí irá la seguridad para verificar si estás logueado)

📂 services (Aquí pondremos la creación de Tokens para el Login)

📂 uploads (Aquí se guardarán las fotos de perfil y publicaciones)

Dentro de uploads, crea una carpeta users y otra publications.


dependencias a utilizar:


