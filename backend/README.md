# CrumbSkate Backend

API RESTful desarrollada con Node.js, Express y TypeScript. Esta API maneja toda la lógica de negocio, autenticación de usuarios y persistencia de datos (con MariaDB) para el e-commerce de CrumbSkate.

## Requisitos

- Node.js (v18 o superior)
- MariaDB (o MySQL compatible)

## Configuración y Variables de Entorno

1. Crea un archivo `.env` en la raíz de `backend`.
2. Completa las siguientes variables de entorno:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=crumbskate_db
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRES_IN=24h
```

## Instalación

```bash
npm install
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo utilizando `nodemon` y `ts-node`.
- `npm run build`: Transpila el código TypeScript a JavaScript en la carpeta `dist`.
- `npm start`: Inicia el servidor en producción utilizando los archivos generados en `dist`.

## Tecnologías Principales

- Node.js & Express
- TypeScript
- MariaDB (mysql2 driver)
- JSON Web Tokens (jsonwebtoken)
- bcryptjs (para el hashing de contraseñas)
