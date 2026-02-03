-- Actualizar trigger de auditoría para detectar soft deletes (eliminaciones lógicas)
DROP FUNCTION IF EXISTS auditoria_productos() CASCADE;

CREATE OR REPLACE FUNCTION auditoria_productos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_nuevos)
        VALUES ('productos', 'INSERT', NEW.id, row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        -- Detectar eliminación lógica (soft delete)
        IF OLD.activo = true AND NEW.activo = false THEN
            INSERT INTO auditoria (tabla, operacion, registro_id, datos_anteriores, datos_nuevos)
            VALUES ('productos', 'DELETE', NEW.id, row_to_json(OLD), row_to_json(NEW));
        ELSE
            INSERT INTO auditoria (tabla, operacion, registro_id, datos_anteriores, datos_nuevos)
            VALUES ('productos', 'UPDATE', NEW.id, row_to_json(OLD), row_to_json(NEW));
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('productos', 'DELETE', OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recrear el trigger
DROP TRIGGER IF EXISTS trigger_auditoria_productos ON productos;
CREATE TRIGGER trigger_auditoria_productos
AFTER INSERT OR UPDATE OR DELETE ON productos
FOR EACH ROW
EXECUTE FUNCTION auditoria_productos();
