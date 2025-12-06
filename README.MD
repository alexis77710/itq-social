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


# 🚀 Backend API - Red Social ITQ

Este es el servidor (API REST) del proyecto. Se encarga de la lógica de negocio, conexión a la base de datos y seguridad.
Desarrollado con **Node.js, Express y MongoDB**.

## 📋 Requisitos Previos
Para que esto funcione en tu PC, necesitas tener instalado:
1. **Node.js:** (Versión 18 o superior recomendada).
2. **MongoDB Community Server:** Debe estar instalado y el servicio **corriendo**.
3. **MongoDB Compass:** (Opcional) Para ver los datos visualmente.
4. **Postman:** Para probar las peticiones (opcional).

---

## 🛠️ Instalación y Configuración (Paso a Paso)

Sigue estos pasos **en orden** para no tener errores:

### 1. Instalar dependencias
Abre la terminal en esta carpeta (`backend`) y ejecuta:
```bash
npm install

Configurar Variables de Entorno (.env)
Crea un archivo llamado .env en la raíz de la carpeta backend (junto al index.js). Adentro pega esto: les mando al whatsap me piden 

3. Crear Carpetas para Imágenes 📁
El sistema de subida de archivos necesita que estas carpetas existan físicamente. Si no existen, créalas manualmente:

backend/uploads/users/

backend/uploads/publications/

4. Arrancar el Servidor
Ejecuta el siguiente comando:

Bash

npm start
# O si tienes nodemon instalado globalmente:
nodemon index.js