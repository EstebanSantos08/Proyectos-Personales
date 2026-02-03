const pool = require('../config/database');

// Obtener todas las auditorías
exports.getAll = async (req, res) => {
  try {
    const { tabla, accion, limit = 100 } = req.query;
    
    let query = `
      SELECT 
        a.*,
        u.nombre as usuario_nombre
      FROM auditoria a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (tabla && tabla !== 'todos') {
      query += ` AND a.tabla = $${paramCount}`;
      params.push(tabla);
      paramCount++;
    }
    
    if (accion && accion !== 'todos') {
      query += ` AND a.accion = $${paramCount}`;
      params.push(accion);
      paramCount++;
    }
    
    query += ` ORDER BY a.fecha_operacion DESC LIMIT $${paramCount}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener auditorías' 
    });
  }
};

// Obtener auditoría reciente (usando vista)
exports.getReciente = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM vista_auditoria_reciente
      ORDER BY fecha_operacion DESC
      LIMIT 50
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener auditorías recientes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener auditorías recientes' 
    });
  }
};

// Obtener triggers activos
exports.getTriggers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.tgname as nombre,
        c.relname as tabla,
        CASE t.tgtype::integer & 1
          WHEN 1 THEN 'ROW'
          ELSE 'STATEMENT'
        END as nivel,
        CASE t.tgtype::integer & 66
          WHEN 2 THEN 'BEFORE'
          WHEN 64 THEN 'INSTEAD OF'
          ELSE 'AFTER'
        END as momento,
        CASE
          WHEN t.tgtype::integer & 4 = 4 THEN 'INSERT'
          WHEN t.tgtype::integer & 8 = 8 THEN 'DELETE'
          WHEN t.tgtype::integer & 16 = 16 THEN 'UPDATE'
          ELSE 'UNKNOWN'
        END as evento,
        obj_description(t.oid) as descripcion
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'public'
        AND NOT t.tgisinternal
      ORDER BY c.relname, t.tgname
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener triggers:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener triggers' 
    });
  }
};
