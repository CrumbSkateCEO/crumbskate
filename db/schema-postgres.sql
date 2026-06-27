-- ============================================================
-- CrumbSkate - Schema PostgreSQL para Neon.tech
-- Ejecutar en el SQL Editor de Neon una sola vez
-- ============================================================

-- Tipos ENUM de PostgreSQL
CREATE TYPE rol_usuario AS ENUM ('cliente', 'admin');
CREATE TYPE genero_producto AS ENUM ('femenino', 'masculino', 'unisex');
CREATE TYPE estado_pedido AS ENUM ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado');
CREATE TYPE estado_pago AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- ============ USUARIOS ============
CREATE TABLE IF NOT EXISTS usuarios (
  id           SERIAL PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono     VARCHAR(50),
  rol          rol_usuario DEFAULT 'cliente',
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ============ CATEGORIAS ============
CREATE TABLE IF NOT EXISTS categorias (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- ============ PRODUCTOS ============
CREATE TABLE IF NOT EXISTS productos (
  id               SERIAL PRIMARY KEY,
  categoria_id     INT REFERENCES categorias(id) ON DELETE SET NULL,
  nombre           VARCHAR(150) NOT NULL,
  descripcion      TEXT,
  marca            VARCHAR(50),
  codigo_sku       VARCHAR(50) UNIQUE,
  precio_base      DECIMAL(10,2) NOT NULL,
  imagen_url       VARCHAR(255),
  mercadolibre_url VARCHAR(255),
  activo           BOOLEAN DEFAULT true,
  genero           genero_producto DEFAULT 'unisex'
);

-- ============ VARIANTES ============
CREATE TABLE IF NOT EXISTS variantes (
  id          SERIAL PRIMARY KEY,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  talla       VARCHAR(50),
  color       VARCHAR(50),
  stock       INT DEFAULT 0,
  precio_extra DECIMAL(10,2) DEFAULT 0.00
);

-- ============ CARRITO ============
CREATE TABLE IF NOT EXISTS carrito (
  id         SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============ CARRITO ITEMS ============
CREATE TABLE IF NOT EXISTS carrito_items (
  id          SERIAL PRIMARY KEY,
  carrito_id  INT NOT NULL REFERENCES carrito(id) ON DELETE CASCADE,
  variante_id INT NOT NULL REFERENCES variantes(id) ON DELETE CASCADE,
  cantidad    INT NOT NULL DEFAULT 1
);

-- ============ PEDIDOS ============
CREATE TABLE IF NOT EXISTS pedidos (
  id            SERIAL PRIMARY KEY,
  usuario_id    INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  estado        estado_pedido DEFAULT 'pendiente',
  total         DECIMAL(10,2) NOT NULL,
  ml_order_id   VARCHAR(100),
  observaciones TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ============ PEDIDO ITEMS ============
CREATE TABLE IF NOT EXISTS pedido_items (
  id              SERIAL PRIMARY KEY,
  pedido_id       INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  variante_id     INT REFERENCES variantes(id) ON DELETE SET NULL,
  cantidad        INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL
);

-- ============ PAGOS ============
CREATE TABLE IF NOT EXISTS pagos (
  id             SERIAL PRIMARY KEY,
  pedido_id      INT NOT NULL UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
  ml_payment_id  VARCHAR(100),
  estado         estado_pago DEFAULT 'pendiente',
  monto          DECIMAL(10,2) NOT NULL,
  fecha          TIMESTAMP DEFAULT NOW()
);

-- ============ CUPONES ============
CREATE TABLE IF NOT EXISTS cupones (
  id                   SERIAL PRIMARY KEY,
  codigo               VARCHAR(50) NOT NULL UNIQUE,
  descuento_porcentaje DECIMAL(5,2) NOT NULL,
  valido_hasta         TIMESTAMP,
  activo               BOOLEAN DEFAULT true,
  created_at           TIMESTAMP DEFAULT NOW()
);

-- ============ RESENAS ============
CREATE TABLE IF NOT EXISTS resenas (
  id          SERIAL PRIMARY KEY,
  usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario  TEXT,
  aprobado    BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============ CONFIGURACION ============
CREATE TABLE IF NOT EXISTS configuracion (
  id         SERIAL PRIMARY KEY,
  clave      VARCHAR(100) NOT NULL UNIQUE,
  valor      TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ DATOS INICIALES ============
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Remeras', 'Categoría base'),
  ('Buzos', 'Categoría base'),
  ('Gorras', 'Categoría base'),
  ('Medias', 'Categoría base'),
  ('Bolsos', 'Categoría base'),
  ('Accesorios', 'Categoría base')
ON CONFLICT DO NOTHING;

INSERT INTO configuracion (clave, valor) VALUES
  ('costo_envio', '5000'),
  ('youtube_url', 'https://youtube.com/@crumbskate'),
  ('email_contacto', 'contacto@crumbskate.com'),
  ('instagram_url', 'https://instagram.com/crumbskate'),
  ('envio_gratis_desde', '50000'),
  ('moneda', 'ARS')
ON CONFLICT (clave) DO NOTHING;
