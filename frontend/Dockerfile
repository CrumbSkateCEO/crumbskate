# Etapa 1 (Builder): Construcción de la aplicación
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del proyecto
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2 (Producción): Servir con Nginx
FROM nginx:alpine

# Copiar la configuración de Nginx creada en el paso 2
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados de la Etapa 1 a la carpeta estática de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80 del contenedor
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
