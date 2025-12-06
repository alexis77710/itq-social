# Frontend

este es el frontend del backend aqui descargaremos estas librerias:
ngx-moment es la herramienta mágica que convierte una fecha aburrida como 176429... en algo bonito como "Hace 5 minutos". se instala con el comando 
dentro del frontend en la terminal poner esto:

npm install moment ngx-moment --save

En tu foto del Timeline, la fecha dice: "1/21/70". Eso pasa porque el Backend guarda la fecha en segundos (Unix Timestamp), pero Angular espera milisegundos. Por eso cree que estás en 1970 (el inicio de los tiempos de la informática).

esto pasaba cuando importabamos esta libreria para ver las fechas correctas de cada publicacion
se soluciona  multiplicando por 1000 en el HTML.

# 🌐 Frontend - Red Social ITQ (Angular 19)

Esta es la interfaz de usuario (Cliente) para la red social del proyecto final.
Está construida con **Angular 19** y consume la API REST del Backend (Node.js).

## 🛠️ Tecnologías y Librerías
- **Angular 19:** Framework principal (Standalone Components).
- **Bootstrap 5:** Diseño y maquetación responsive.
- **RxJS:** Manejo de observables y peticiones HTTP.
- **Moment.js:** Formato de fechas (opcional, usamos Pipes nativos).
- **CSS3:** Variables CSS para temas (Modo Claro / Oscuro).

---

## ⚙️ Instrucciones para Arrancar (Setup)

Si te descargas este proyecto de cero, sigue estos pasos:

1. **Instalar dependencias:**
   Abrir terminal en la carpeta `frontend` y ejecutar:
   ```bash
   npm install

   Configurar API (Si es necesario): Si tu backend no está en el puerto 3800, edita el archivo: src/app/services/GLOBAL.ts

 //  export var GLOBAL = {
    url: 'http://localhost:3800/api/'
}

ng serve -o

Módulos y Funcionalidades
🔐 1. Autenticación (Auth)
Login: Genera token JWT y guarda la sesión en localStorage.

Registro: Formulario validado para nuevos usuarios.

Logout: Borra la sesión y redirige al login.

Guards: auth.guard.ts protege las rutas privadas (nadie entra sin loguearse).

👤 2. Usuario y Perfil
Edición de Datos: Permite cambiar nombre, nick, email y biografía.

Avatar: Subida de foto de perfil con previsualización.

Listado de Gente: Ver a todos los usuarios paginados.

Perfil Público: Ver la ficha de cualquier usuario con su foto grande.

📰 3. Muro (Timeline)
Publicar: Formulario para texto e imagen.

Feed: Lista de publicaciones de todos los usuarios (orden cronológico).

Diseño: Tarjetas flotantes con estilos personalizados.

💬 4. Mensajería Privada
Enviar: Formulario para escribirle a cualquier usuario registrado.

Bandeja de Entrada: Ver mensajes recibidos.

Bandeja de Salida: Ver mensajes enviados.

Interfaz: Diseño tipo correo electrónico.

🎨 5. Diseño y UX
Modo Oscuro 🌙: Botón en el menú para cambiar de tema.

Colores ITQ: Uso de Rojo/Negro institucional.

Estilo Pinterest: Tarjetas con bordes redondeados y sombras suaves.

📂 Estructura Clave
src/app/components/: Vistas (Login, Home, Timeline, Messages...).

src/app/services/: Lógica de conexión con la API (user.service, publication.service, message.service).

src/app/models/: Clases para tipado fuerte (User, Publication, Message).

src/app/guards/: Seguridad de rutas.

Desarrollado por: Alexis Master & Team Estado: Frontend Terminado 100% ✅ (Versión HTTP)