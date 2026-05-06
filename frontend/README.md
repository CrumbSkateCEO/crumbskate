# CrumbSkate Frontend

Cliente web del e-commerce CrumbSkate. Construido como una Single Page Application (SPA) utilizando React, TypeScript y Vite. Presenta una interfaz de usuario moderna con Tailwind CSS y DaisyUI, además de un tema oscuro urbano.

## Requisitos

- Node.js (v18 o superior)

## Configuración y Variables de Entorno

1. Crea un archivo `.env` en la raíz de `frontend` (opcional, por defecto la API apuntará a `http://localhost:5000/api`).
2. Puedes sobreescribir la URL de la API con:

```env
VITE_API_URL=http://localhost:5000/api
```

## Instalación

```bash
npm install
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en Vite.
- `npm run build`: Transpila TypeScript y construye los archivos estáticos listos para producción en la carpeta `dist`.
- `npm run preview`: Previsualiza la build de producción localmente.

## Tecnologías Principales

- React & TypeScript
- Vite
- Tailwind CSS & DaisyUI
- Axios
- React Router DOM
