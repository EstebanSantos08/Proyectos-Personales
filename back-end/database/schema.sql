-- ============================================
-- BASE DE DATOS: ventas
-- Sistema de Ventas con Procedimientos Almacenados, Triggers y Auditoría
-- ============================================

-- Crear base de datos
DROP DATABASE IF EXISTS ventas;
CREATE DATABASE ventas;

\c ventas;

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'completada' CHECK (estado IN ('completada', 'cancelada'))
);

-- Tabla de detalle de ventas
CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- ============================================
-- TABLA DE AUDITORÍA
-- ============================================

CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    tabla VARCHAR(50) NOT NULL,
    operacion VARCHAR(10) NOT NULL CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    registro_id INTEGER NOT NULL,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    usuario_id INTEGER,
    fecha_operacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRIGGERS PARA VALIDACIONES Y AUDITORÍA
-- ============================================

-- Trigger para validar stock antes de insertar detalle de venta
CREATE OR REPLACE FUNCTION validar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT stock FROM productos WHERE id = NEW.producto_id) < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto ID %', NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_stock
BEFORE INSERT ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION validar_stock_venta();

-- Trigger para actualizar stock después de venta
CREATE OR REPLACE FUNCTION actualizar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos 
    SET stock = stock - NEW.cantidad 
    WHERE id = NEW.producto_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock
AFTER INSERT ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_venta();

-- Trigger para calcular subtotal automáticamente
CREATE OR REPLACE FUNCTION calcular_subtotal()
RETURNS TRIGGER AS $$
BEGIN
    NEW.subtotal := NEW.cantidad * NEW.precio_unitario;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_subtotal
BEFORE INSERT OR UPDATE ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION calcular_subtotal();

-- ============================================
-- TRIGGERS DE AUDITORÍA
-- ============================================

-- Auditoría para productos
CREATE OR REPLACE FUNCTION auditoria_productos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_nuevos)
        VALUES ('productos', 'INSERT', NEW.id, row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_anteriores, datos_nuevos)
        VALUES ('productos', 'UPDATE', NEW.id, row_to_json(OLD), row_to_json(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('productos', 'DELETE', OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auditoria_productos
AFTER INSERT OR UPDATE OR DELETE ON productos
FOR EACH ROW
EXECUTE FUNCTION auditoria_productos();

-- Auditoría para ventas
CREATE OR REPLACE FUNCTION auditoria_ventas()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_nuevos, usuario_id)
        VALUES ('ventas', 'INSERT', NEW.id, row_to_json(NEW), NEW.usuario_id);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_anteriores, datos_nuevos, usuario_id)
        VALUES ('ventas', 'UPDATE', NEW.id, row_to_json(OLD), row_to_json(NEW), NEW.usuario_id);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_anteriores, usuario_id)
        VALUES ('ventas', 'DELETE', OLD.id, row_to_json(OLD), OLD.usuario_id);
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auditoria_ventas
AFTER INSERT OR UPDATE OR DELETE ON ventas
FOR EACH ROW
EXECUTE FUNCTION auditoria_ventas();

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento: Crear producto
CREATE OR REPLACE FUNCTION sp_crear_producto(
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_precio DECIMAL,
    p_stock INTEGER
) RETURNS INTEGER AS $$
DECLARE
    nuevo_id INTEGER;
BEGIN
    INSERT INTO productos (nombre, descripcion, precio, stock)
    VALUES (p_nombre, p_descripcion, p_precio, p_stock)
    RETURNING id INTO nuevo_id;
    
    RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento: Actualizar producto
CREATE OR REPLACE FUNCTION sp_actualizar_producto(
    p_id INTEGER,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_precio DECIMAL,
    p_stock INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE productos 
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio,
        stock = p_stock
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento: Eliminar producto (soft delete)
CREATE OR REPLACE FUNCTION sp_eliminar_producto(p_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE productos SET activo = false WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento: Crear venta completa
CREATE OR REPLACE FUNCTION sp_crear_venta(
    p_usuario_id INTEGER,
    p_productos JSONB -- [{producto_id, cantidad, precio_unitario}]
) RETURNS INTEGER AS $$
DECLARE
    nueva_venta_id INTEGER;
    item JSONB;
    total_venta DECIMAL := 0;
BEGIN
    -- Crear la venta
    INSERT INTO ventas (usuario_id, total)
    VALUES (p_usuario_id, 0)
    RETURNING id INTO nueva_venta_id;
    
    -- Insertar detalles
    FOR item IN SELECT * FROM jsonb_array_elements(p_productos)
    LOOP
        INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario)
        VALUES (
            nueva_venta_id,
            (item->>'producto_id')::INTEGER,
            (item->>'cantidad')::INTEGER,
            (item->>'precio_unitario')::DECIMAL
        );
        
        total_venta := total_venta + ((item->>'cantidad')::INTEGER * (item->>'precio_unitario')::DECIMAL);
    END LOOP;
    
    -- Actualizar total de la venta
    UPDATE ventas SET total = total_venta WHERE id = nueva_venta_id;
    
    RETURN nueva_venta_id;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento: Ventas totales
CREATE OR REPLACE FUNCTION sp_ventas_totales()
RETURNS TABLE (
    total_ventas BIGINT,
    monto_total DECIMAL,
    promedio_venta DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT,
        COALESCE(SUM(total), 0),
        COALESCE(AVG(total), 0)
    FROM ventas
    WHERE estado = 'completada';
END;
$$ LANGUAGE plpgsql;

-- Procedimiento: Ventas por fecha
CREATE OR REPLACE FUNCTION sp_ventas_por_fecha(
    fecha_inicio DATE,
    fecha_fin DATE
) RETURNS TABLE (
    venta_id INTEGER,
    fecha TIMESTAMP,
    usuario VARCHAR,
    total DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.fecha_venta,
        u.nombre,
        v.total
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
    WHERE DATE(v.fecha_venta) BETWEEN fecha_inicio AND fecha_fin
    AND v.estado = 'completada'
    ORDER BY v.fecha_venta DESC;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento: Productos más vendidos
CREATE OR REPLACE FUNCTION sp_productos_mas_vendidos(limite INTEGER DEFAULT 10)
RETURNS TABLE (
    producto_id INTEGER,
    producto VARCHAR,
    cantidad_vendida BIGINT,
    total_generado DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nombre,
        SUM(dv.cantidad)::BIGINT,
        SUM(dv.subtotal)
    FROM detalle_ventas dv
    JOIN productos p ON dv.producto_id = p.id
    JOIN ventas v ON dv.venta_id = v.id
    WHERE v.estado = 'completada'
    GROUP BY p.id, p.nombre
    ORDER BY SUM(dv.cantidad) DESC
    LIMIT limite;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VISTAS
-- ============================================

-- Vista: Reporte de ventas
CREATE OR REPLACE VIEW vista_reporte_ventas AS
SELECT 
    v.id AS venta_id,
    v.fecha_venta,
    u.nombre AS usuario,
    u.email,
    v.total,
    v.estado,
    COUNT(dv.id) AS cantidad_productos
FROM ventas v
JOIN usuarios u ON v.usuario_id = u.id
LEFT JOIN detalle_ventas dv ON v.venta_id = dv.id
GROUP BY v.id, v.fecha_venta, u.nombre, u.email, v.total, v.estado
ORDER BY v.fecha_venta DESC;

-- Vista: Inventario actual
CREATE OR REPLACE VIEW vista_inventario AS
SELECT 
    id,
    nombre,
    descripcion,
    precio,
    stock,
    CASE 
        WHEN stock = 0 THEN 'Sin stock'
        WHEN stock < 10 THEN 'Stock bajo'
        ELSE 'Stock normal'
    END AS estado_stock,
    activo
FROM productos
WHERE activo = true
ORDER BY stock ASC;

-- Vista: Auditoría reciente
CREATE OR REPLACE VIEW vista_auditoria_reciente AS
SELECT 
    a.id,
    a.tabla,
    a.operacion,
    a.registro_id,
    a.fecha_operacion,
    u.nombre AS usuario
FROM auditoria a
LEFT JOIN usuarios u ON a.usuario_id = u.id
ORDER BY a.fecha_operacion DESC
LIMIT 100;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Usuario admin (password: admin123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@ventas.com', '$2a$10$XqY9z4jK9vZ5gN2mP7rO6eJkL8wH3nF4vB6tC2dE1fG5hI7jK8lM9', 'admin');

-- Usuario normal (password: usuario123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Juan Pérez', 'juan@ventas.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012', 'usuario');

-- Productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop HP', 'Laptop HP 15.6" Intel Core i5 8GB RAM', 599.99, 15),
('Mouse Logitech', 'Mouse inalámbrico Logitech M185', 15.99, 50),
('Teclado Mecánico', 'Teclado mecánico RGB retroiluminado', 79.99, 25),
('Monitor Samsung', 'Monitor Samsung 24" Full HD', 189.99, 10),
('Auriculares Sony', 'Auriculares inalámbricos Sony WH-1000XM4', 299.99, 8);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_detalle_venta ON detalle_ventas(venta_id);
CREATE INDEX idx_detalle_producto ON detalle_ventas(producto_id);
CREATE INDEX idx_auditoria_fecha ON auditoria(fecha_operacion);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- ============================================
-- PERMISOS (OPCIONAL)
-- ============================================

-- Comentario: Aquí puedes agregar permisos específicos si usas roles de PostgreSQL
