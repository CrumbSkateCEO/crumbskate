# CrumbSkate — Documentación del Proyecto

**Qué es este documento:** Un resumen claro de todo lo que se construyó en CrumbSkate durante los últimos dos meses (abril–junio 2026). Está pensado para que cualquier persona del equipo — o quien quiera entender el proyecto — pueda leerlo sin necesidad de saber programación.

**Versión:** 1.1  
**Fecha:** 26 de junio de 2026

---

## Índice

1. [¿Qué es CrumbSkate?](#1-qué-es-crumbskate)
2. [¿De dónde partimos y a dónde llegamos?](#2-de-dónde-partimos-y-a-dónde-llegamos)
3. [¿Cómo funciona la tienda para el cliente?](#3-cómo-funciona-la-tienda-para-el-cliente)
4. [¿Qué puede hacer un administrador?](#4-qué-puede-hacer-un-administrador)
5. [Cronología: qué se hizo mes a mes](#5-cronología-qué-se-hizo-mes-a-mes)
6. [Las partes del proyecto explicadas en simple](#6-las-partes-del-proyecto-explicadas-en-simple)
7. [Seguridad y confianza del usuario](#7-seguridad-y-confianza-del-usuario)
8. [Cómo se puede usar el proyecto hoy](#8-cómo-se-puede-usar-el-proyecto-hoy)
9. [Qué falta y qué viene después](#9-qué-falta-y-qué-viene-después)
10. [Equipo y roles](#10-equipo-y-roles)

---

## 1. ¿Qué es CrumbSkate?

CrumbSkate es una **tienda online** de ropa y accesorios para skaters, pensada para jóvenes en Argentina. La idea es que una persona pueda entrar a la página, ver productos, elegir tallas, agregarlos al carrito, registrarse, comprar y hacer seguimiento de sus pedidos.

Los pagos están pensados para integrarse con **Mercado Libre / Mercado Pago**, que es la forma más habitual de cobrar en el país.

En pocas palabras: es como tener un local de ropa skater, pero en internet, con un panel interno para que el dueño o el equipo administre productos, stock, pedidos y clientes sin tocar código.

---

## 2. ¿De dónde partimos y a dónde llegamos?

### Al inicio (finales de abril 2026)

La tienda existía **solo en la pantalla del navegador**. Los productos eran datos de prueba cargados a mano en el código. Había un carrito y una pantalla de administración muy básica, pero **no había un servidor real** guardando la información. Si cerrabas la página o cambiabas de computadora, no había una base de datos central que respaldara todo.

Era útil para **mostrar cómo se vería la tienda**, pero no para vender de verdad.

### Hoy (junio 2026)

Ahora CrumbSkate es un **sistema completo**:

- Una **página web** donde entra el cliente.
- Un **servidor** (backend) que procesa registros, carritos, pedidos y administración.
- Una **base de datos** donde se guarda todo de forma permanente: usuarios, productos, stock, pedidos, cupones, reseñas, etc.
- Un **panel de administración** con muchas secciones para manejar el negocio.
- Formas de **instalar y ejecutar** el proyecto en distintos entornos: en la computadora del desarrollador, en la nube o en un servidor propio.

### En una frase

Pasamos de un **prototipo visual** a una **plataforma de e-commerce funcional**, lista para seguir creciendo.

---

## 3. ¿Cómo funciona la tienda para el cliente?

Esta sección describe el recorrido de una persona que entra a comprar, sin entrar en detalles técnicos.

### 3.1 Entrar y explorar

El cliente abre la página principal y ve el catálogo de productos: remeras, buzos, gorras, etc. Puede hacer clic en un producto para ver fotos, descripción, precio y **tallas disponibles**. Solo se muestran productos que están activos en la tienda.

### 3.2 Registrarse o iniciar sesión

Para agregar cosas al carrito y comprar, la persona debe **crear una cuenta** o **iniciar sesión**. Al registrarse, el sistema guarda su nombre, email y contraseña de forma segura (la contraseña no se guarda en texto plano; se guarda encriptada).

Si olvida la contraseña, puede pedir un **email de recuperación** y crear una nueva.

### 3.3 Carrito de compras

Una vez logueado, puede agregar productos al carrito eligiendo talla y cantidad. El carrito **queda guardado en la cuenta**: si cierra la página y vuelve otro día, sus productos siguen ahí (siempre que inicie sesión de nuevo).

Desde el carrito puede cambiar cantidades o quitar artículos antes de pagar.

### 3.4 Finalizar la compra (checkout)

Cuando está listo, va al checkout. Ahí el sistema:

1. Revisa que haya productos en el carrito.
2. Verifica que haya **stock suficiente** para cada talla.
3. Calcula el total.
4. Crea el **pedido** y lo deja registrado.
5. Vacía el carrito.
6. Descuenta el stock vendido.

El cliente puede ver sus pedidos anteriores y el detalle de cada uno desde su **perfil**.

### 3.5 Lo que el cliente ve hoy vs. lo que falta

**Ya funciona:** navegar, registrarse, carrito, crear pedidos, ver historial, recuperar contraseña.

**Todavía en desarrollo:** el cobro automático con Mercado Pago al finalizar la compra. El sistema ya tiene preparado el lugar donde irá ese pago, pero la integración completa con Mercado Libre aún no está terminada.

---

## 4. ¿Qué puede hacer un administrador?

No todos los usuarios son iguales. Hay **clientes** y **administradores**. Los administradores entran a una zona especial de la web: el **panel de administración** (`/admin`).

Si alguien que no es admin intenta entrar, el sistema lo redirige al login.

### 4.1 Panel principal (Dashboard)

Es la “pantalla de inicio” del admin. Muestra números importantes del negocio:

- Cuánto se vendió en total.
- Cuántos pedidos hubo.
- Cuánto gasta en promedio cada cliente por compra.
- Los pedidos más recientes.

También avisa cuando hay cosas que requieren atención: pedidos pendientes, productos con poco stock o reseñas que hay que revisar.

### 4.2 Productos

Desde acá se pueden **crear, editar y desactivar** productos. Cada producto puede tener:

- Nombre, descripción, marca, precio.
- Categoría (remeras, buzos, etc.).
- Foto (se sube desde la computadora).
- Varias **tallas/colores**, cada una con su propio stock.

Cuando un producto ya no se vende, no se borra del todo: se **desactiva**, para no perder el historial de pedidos viejos.

### 4.3 Categorías

Organizan el catálogo. Por ejemplo: Remeras, Buzos, Gorras, Medias, Bolsos, Accesorios. Facilita que el cliente filtre y encuentre lo que busca.

### 4.4 Pedidos

Lista todos los pedidos de todos los clientes. El admin puede ver estados (pendiente, confirmado, enviado, entregado, cancelado) y hacer seguimiento.

### 4.5 Stock

Muestra cuántas unidades quedan de cada talla de cada producto. Si el stock es muy bajo, el dashboard lo marca como alerta.

### 4.6 Cupones de descuento

Permite crear códigos promocionales (por ejemplo “VERANO20”) con un porcentaje de descuento y fecha de vencimiento. El cliente podría usarlos al comprar cuando esa función esté conectada al checkout.

### 4.7 Reseñas

Los clientes pueden dejar opiniones sobre productos. El admin puede **aprobar o rechazar** reseñas antes de que se muestren públicamente, para evitar contenido inapropiado.

### 4.8 Reportes

Gráficos y listas para entender el negocio: ventas por día, productos más vendidos. Sirve para decidir qué reponer, qué promocionar o qué dejar de vender.

### 4.9 Configuración de la tienda

Valores que se pueden cambiar **sin tocar el código**, por ejemplo:

- Costo de envío.
- Teléfono y email de contacto.
- Link de Instagram.
- Monto mínimo para envío gratis.
- Mensaje de bienvenida en la home.

### 4.10 Usuarios

Ver listado de clientes y administradores. Se puede cambiar el rol de un usuario (por ejemplo, convertir a alguien de confianza en administrador).

### 4.11 Newsletter

Los visitantes pueden dejar su email para recibir novedades. Esos emails quedan guardados para futuras campañas.

---

## 5. Cronología: qué se hizo mes a mes

A continuación se resume el trabajo realizado, en orden cronológico, explicado de forma sencilla.

### Abril 2026 — La tienda empieza a tomar forma

**Qué se hizo:** Se armó la parte visible de la tienda: página principal, tarjetas de productos, detalle de cada producto, carrito, login, registro y una primera versión del panel admin.

**Para qué sirvió:** Tener algo concreto para mostrar, probar diseño y definir cómo sería la experiencia del usuario.

**Limitación de esa etapa:** Los productos eran de prueba y no venían de una base de datos real.

---

### Mayo 2026 — Conectar la tienda con el “cerebro” del sistema

**Qué se hizo:**

- Se creó el **servidor** que responde cuando la web pide datos (login, productos, carrito, pedidos).
- Se conectó la página con ese servidor: dejó de usar datos falsos.
- Se mejoró mucho el **diseño visual** (colores, tipografía, animaciones, experiencia en celular).
- Se agregaron páginas importantes: **checkout**, **perfil del usuario** y **detalle de pedido**.
- Se preparó el proyecto para correr dentro de **Docker** (una forma empaquetada de instalar todo junto).

**Para qué sirvió:** La tienda empezó a comportarse como un e-commerce de verdad: lo que hace el usuario se guarda y persiste.

---

### Junio 2026 — Panel de administración completo e infraestructura

**Qué se hizo:**

- Se expandió el panel admin de **una sola pantalla** a **diez secciones** (productos, pedidos, stock, cupones, reportes, etc.).
- Se agregó la **recuperación de contraseña** por email.
- Se definieron scripts para **arrancar el proyecto fácilmente** en distintos modos (desarrollo local, producción).
- Se configuró el despliegue pensado para **Vercel** (frontend), **Render** (backend) y **Neon** (base de datos en la nube).
- Se preparó la opción de correr todo en un **servidor propio** con dominio y certificado de seguridad (HTTPS).

**Para qué sirvió:** El equipo puede administrar la tienda sin depender de un programador para cada cambio de producto o precio, y el proyecto está más cerca de estar online para usuarios reales.

---

## 6. Las partes del proyecto explicadas en simple

Imaginá CrumbSkate como un edificio con tres pisos:

### Piso 1 — La tienda (Frontend)

Es lo que **ve y toca el usuario**: botones, imágenes, formularios, carrito. Está hecho con **React**, una tecnología muy usada para páginas web modernas que se sienten rápidas y fluidas.

**Analogía:** Es el mostrador y los probadores del local.

### Piso 2 — El servidor (Backend)

Es el **cerebro** que no se ve. Cuando alguien hace clic en “Comprar” o “Iniciar sesión”, la tienda le pide algo al servidor, y el servidor decide qué hacer: guardar el pedido, revisar stock, validar la contraseña, etc.

Está hecho con **Node.js** y **Express**, herramientas estándar para crear servicios web.

**Analogía:** Es el depósito, la caja registradora y el encargado que verifica que todo esté en orden.

### Piso 3 — La base de datos

Es donde **se guarda todo de forma permanente**: cuentas, productos, cuánto stock queda, pedidos, cupones. Usamos **PostgreSQL**, una base de datos robusta y muy usada en el mundo profesional. En la nube puede estar en **Neon**; en desarrollo, en la computadora local.

**Analogía:** Es el archivo, el inventario en papel (pero digital) y el historial de ventas.

### Extra — Docker y scripts de inicio

**Docker** permite empaquetar la tienda, el servidor y (opcionalmente) la base de datos para que cualquier persona del equipo pueda levantar el proyecto con pocos pasos, sin pelearse con instalaciones complicadas.

Los scripts como `start-crumbskate.sh` son atajos que automatizan ese proceso.

**Analogía:** Es la llave maestra para abrir el local entero con un solo botón.

---

## 7. Seguridad y confianza del usuario

Cuando una tienda maneja contraseñas y datos de clientes, la seguridad importa. Esto es lo que el proyecto ya tiene implementado, explicado sin tecnicismos:

| Qué protege | Cómo lo hace |
|-------------|--------------|
| Contraseñas | No se guardan tal cual las escribe el usuario. Se guardan “hasheadas”, es decir, transformadas de forma irreversible. |
| Sesiones | Al iniciar sesión, el sistema entrega un token (como un pase temporal) que expira después de un tiempo. |
| Acceso admin | Solo usuarios con rol de administrador pueden entrar al panel de gestión. |
| Ataques comunes | Se usan herramientas que bloquean intentos masivos de acceso y protegen ciertos encabezados de la web. |
| Datos sensibles | Claves y contraseñas de servicios no van en el código público; van en archivos de configuración privados (`.env`). |
| Pedidos | Al crear un pedido, todo se hace de una sola vez: si algo falla (por ejemplo, no hay stock), no se cobra a medias ni se descuenta stock incorrectamente. |
| Imágenes | Solo se permiten subir archivos de imagen, con un tamaño máximo, para evitar abusos. |

En resumen: el proyecto no es solo “una página linda”, sino que tiene bases de seguridad pensadas para un comercio real.

---

## 8. Cómo se puede usar el proyecto hoy

### Para probar en la computadora (desarrollo)

El equipo puede levantar la tienda en modo local. Hay un script principal que facilita esto:

```bash
./start-crumbskate.sh local
```

Eso intenta levantar la base de datos local, el servidor y la página web para probar todo en `localhost`.

También existe modo `prod` para conectar con la base de datos en la nube (Neon) en lugar de una local.

### Para publicar en internet (producción)

La idea de despliegue actual es:

| Parte | Dónde vive | Para qué |
|-------|------------|----------|
| Página web | Vercel | Rápida, gratuita para proyectos, ideal para React |
| Servidor / API | Render | Ejecuta el backend las 24 horas |
| Base de datos | Neon | PostgreSQL en la nube, con respaldo |

También se puede hostear **todo en un servidor propio** (por ejemplo con dominio `crumbskate.edu.ar`) usando Docker, Nginx y certificados SSL.

### Qué necesita configurarse (sin entrar en detalle)

Antes de poner la tienda online de verdad, alguien del equipo debe completar:

- URL de la base de datos.
- Clave secreta para las sesiones.
- URL de la página web (para que el servidor acepte las peticiones).
- Datos de email (para recuperar contraseñas).
- Credenciales de Mercado Pago (cuando se implemente el cobro).

Todo eso va en archivos de configuración, no en el código que se sube a GitHub.

---

## 9. Qué falta y qué viene después

Ningún proyecto queda “terminado” de un día para otro. Estas son las áreas que aún requieren trabajo o mejora:

### Prioridad alta

1. **Pagos con Mercado Pago** — Hoy se crea el pedido, pero el cobro automático al cliente aún no está conectado.
2. **Actualizar documentación general** — El README principal del repo todavía menciona tecnologías viejas (MySQL, Railway) que ya no son las que usa el proyecto.
3. **Migraciones de base de datos más ordenadas** — Para que los cambios futuros en la estructura de datos se apliquen de forma controlada en producción.

### Prioridad media

4. **Almacenamiento de imágenes en la nube** — Hoy las fotos de productos se guardan en el servidor. En servicios como Render, eso puede borrarse al redeployar. Conviene usar un servicio de archivos (tipo Cloudinary o S3).
5. **Mejor experiencia si no estás logueado** — Si alguien intenta agregar al carrito sin cuenta, conviene mostrarle un mensaje claro y llevarlo al registro.
6. **Pruebas automáticas** — Tests que verifiquen que login, carrito y pedidos siguen funcionando después de cada cambio.

### Ideas para más adelante

- Notificaciones por email cuando cambia el estado de un pedido.
- App móvil o versión PWA.
- Más métodos de pago.
- Programa de puntos o fidelización.
- Integración con redes sociales para login rápido.

---

## 10. Equipo y roles

| Persona | Rol en el proyecto |
|---------|-------------------|
| Fernando Flor | Líder del proyecto, backend y frontend |
| Santiago Medina | Base de datos y backend |
| Liz Benitez | Diseño y documentación |

### Cómo se reparte el trabajo (en términos simples)

- **Fernando** lidera la visión técnica y construye gran parte de lo que ve el usuario y lo que corre en el servidor.
- **Santiago** se enfoca en que los datos estén bien organizados, que la base de datos funcione y que el backend sea confiable.
- **Liz** cuida que la experiencia visual y la documentación (como este archivo) sean claras para el equipo y para quien evalúe el proyecto.

---

## Resumen final

En dos meses, CrumbSkate pasó de ser una **maqueta interactiva** a una **plataforma de comercio electrónico** con:

- Tienda online para clientes (catálogo, carrito, cuenta, pedidos).
- Panel de administración completo para manejar el negocio.
- Base de datos real y servidor que procesa todo.
- Caminos definidos para desarrollo local y publicación en internet.
- Bases de seguridad para proteger usuarios y datos.

Lo más importante para entender el estado actual: **la estructura del negocio digital ya está armada**. Lo que falta es principalmente conectar el cobro con Mercado Pago, pulir detalles de producción y seguir mejorando la experiencia del cliente.

---

## Cómo guardar este documento en PDF

1. Abrí el archivo `DOCUMENTACION_TECNICA_CRUMBSKATE.html` (en la carpeta `docs/`) con Chrome o Firefox.
2. Presioná **Ctrl + P**.
3. Elegí **Guardar como PDF**.
4. Guardá el archivo donde quieras (Drive, USB, etc.).

También podés subir el archivo `.md` o `.html` directamente a Google Drive.

---

*Documento elaborado a partir del trabajo realizado en el repositorio CrumbSkate entre abril y junio de 2026.*
