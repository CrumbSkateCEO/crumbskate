# Arquitectura del Sistema: CrumbSkate

El proyecto CrumbSkate sigue una arquitectura clásica cliente-servidor (Client-Server Architecture) donde el frontend y el backend están completamente separados, comunicándose a través de una API RESTful.

## Frontend (Cliente)

- **Tecnologías:** React, TypeScript, Vite.
- **Estilos:** Tailwind CSS con componentes de DaisyUI.
- **Responsabilidad:** Gestionar la interfaz de usuario, interactuar con el cliente, mantener el estado global de la aplicación (usando Context API para el carrito, la sesión y los productos) y realizar peticiones HTTP al servidor mediante Axios.

## Backend (Servidor)

- **Tecnologías:** Node.js, Express, TypeScript.
- **Responsabilidad:** Manejar la lógica de negocio, validar la información, gestionar la seguridad (autenticación y autorización usando JWT y bcrypt) e interactuar con la base de datos.
- **CORS:** El servidor de Express implementa el middleware CORS para aceptar peticiones provenientes de clientes desde otros dominios o puertos.

## Base de Datos

- **Tecnologías:** MariaDB.
- **Responsabilidad:** Persistencia de datos. Almacena de forma relacional tablas de `usuarios`, `productos`, `pedidos` y `categorias`.

## Diagrama de Flujo

1. El **Cliente** navega por la interfaz de React.
2. Al realizar una acción (ej. ver productos, iniciar sesión), React realiza una solicitud `HTTP GET/POST/PUT/DELETE` usando **Axios** hacia la API (puerto `5000`).
3. **Express** captura la ruta, un middleware opcional verifica el JWT para rutas protegidas, y transfiere el control a un **Controlador**.
4. El **Controlador** interactúa con **MariaDB** ejecutando una consulta SQL (`mysql2/promise`).
5. **MariaDB** devuelve los resultados al Controlador.
6. El **Controlador** envía la respuesta al Cliente en formato `JSON`.
7. **React** procesa la respuesta, actualiza su estado (Context/States locales) y renderiza la interfaz en consecuencia.
