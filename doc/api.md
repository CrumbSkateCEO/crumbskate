# Referencia de la API - CrumbSkate

La API base se encuentra en `/api`. Todas las peticiones consumen y producen `application/json`.

## Autenticación (`/api/auth`)

- `POST /registro`: Registra un nuevo usuario. 
    - Body: `{ nombre, email, password, telefono? }`
- `POST /login`: Inicia sesión y retorna un token JWT junto con los datos básicos del usuario.
    - Body: `{ email, password }`
- `GET /perfil`: Obtiene el perfil completo del usuario autenticado. *(Requiere token)*

## Productos (`/api/productos`)

- `GET /`: Devuelve todos los productos.
- `GET /:id`: Devuelve un producto específico.
- `POST /`: Crea un nuevo producto. *(Requiere token de Admin)*
    - Body: `{ name, price, category, description?, image?, inStock?, sizes? }`
- `PUT /:id`: Actualiza un producto. *(Requiere token de Admin)*
- `DELETE /:id`: Elimina un producto. *(Requiere token de Admin)*

## Categorías (`/api/categorias`)

- `GET /`: Devuelve todas las categorías disponibles en el catálogo.

## Pedidos (`/api/pedidos`)

- `GET /`: Devuelve el listado de pedidos del usuario autenticado. *(Requiere token)*
- `POST /`: Crea un nuevo pedido transformando los ítems actuales del carrito. Vacia el carrito al finalizar con éxito. *(Requiere token)*

## Carrito (`/api/carrito`)

- `GET /`: Obtiene los ítems guardados en el carrito del usuario. *(Requiere token)*
- `POST /`: Añade un producto al carrito. *(Requiere token)*
    - Body: `{ producto_id, cantidad, talla? }`
- `PUT /:item_id`: Actualiza la cantidad de un ítem en el carrito. *(Requiere token)*
- `DELETE /:item_id`: Elimina un ítem específico del carrito. *(Requiere token)*

> **Nota de Seguridad**: Todas las rutas que "Requieren token" necesitan que se envíe el header HTTP `Authorization` con el formato: `Bearer <TOKEN>`.
