const pool = require('../config/database');

// ===== VENTAS CON PROCEDIMIENTOS ALMACENADOS =====

// Crear venta completa
exports.create = async (req, res) => {
  const { productos } = req.body; // [{producto_id, cantidad, precio_unitario}]

  try {
    // Validación
    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    // Llamar al procedimiento almacenado sp_crear_venta
    const result = await pool.query(
      'SELECT sp_crear_venta($1, $2) as venta_id',
      [req.userId, JSON.stringify(productos)]
    );

    const ventaId = result.rows[0].venta_id;

    // Obtener la venta creada con detalles
    const venta = await pool.query(`
      SELECT 
        v.id,
        v.total,
        v.fecha_venta,
        v.estado,
        json_agg(json_build_object(
          'producto', p.nombre,
          'cantidad', dv.cantidad,
          'precio_unitario', dv.precio_unitario,
          'subtotal', dv.subtotal
        )) as detalles
      FROM ventas v
      JOIN detalle_ventas dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id
      WHERE v.id = $1
      GROUP BY v.id
    `, [ventaId]);

    res.status(201).json({
      message: 'Venta registrada exitosamente',
      venta: venta.rows[0]
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    
    // Manejo de errores específicos de triggers
    if (error.message.includes('Stock insuficiente')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al registrar venta' });
  }
};

// Obtener todas las ventas
exports.getAll = async (req, res) => {
  try {
    // Solo admin puede ver todas las ventas
    let query;
    let params;

    if (req.userRole === 'admin') {
      query = `
        SELECT 
          v.id,
          v.total,
          v.fecha_venta,
          v.estado,
          u.nombre as usuario
        FROM ventas v
        JOIN usuarios u ON v.usuario_id = u.id
        ORDER BY v.fecha_venta DESC
      `;
      params = [];
    } else {
      // Usuario normal solo ve sus ventas
      query = `
        SELECT 
          v.id,
          v.total,
          v.fecha_venta,
          v.estado
        FROM ventas v
        WHERE v.usuario_id = $1
        ORDER BY v.fecha_venta DESC
      `;
      params = [req.userId];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

// Obtener detalle de una venta
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar permisos
    let query;
    let params;

    if (req.userRole === 'admin') {
      query = `
        SELECT 
          v.id,
          v.total,
          v.fecha_venta,
          v.estado,
          u.nombre as usuario,
          u.email,
          json_agg(json_build_object(
            'producto', p.nombre,
            'cantidad', dv.cantidad,
            'precio_unitario', dv.precio_unitario,
            'subtotal', dv.subtotal
          )) as detalles
        FROM ventas v
        JOIN usuarios u ON v.usuario_id = u.id
        JOIN detalle_ventas dv ON v.id = dv.venta_id
        JOIN productos p ON dv.producto_id = p.id
        WHERE v.id = $1
        GROUP BY v.id, u.nombre, u.email
      `;
      params = [id];
    } else {
      query = `
        SELECT 
          v.id,
          v.total,
          v.fecha_venta,
          v.estado,
          json_agg(json_build_object(
            'producto', p.nombre,
            'cantidad', dv.cantidad,
            'precio_unitario', dv.precio_unitario,
            'subtotal', dv.subtotal
          )) as detalles
        FROM ventas v
        JOIN detalle_ventas dv ON v.id = dv.venta_id
        JOIN productos p ON dv.producto_id = p.id
        WHERE v.id = $1 AND v.usuario_id = $2
        GROUP BY v.id
      `;
      params = [id, req.userId];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ error: 'Error al obtener venta' });
  }
};

// ===== REPORTES CON PROCEDIMIENTOS ALMACENADOS =====

// Ventas totales (procedimiento almacenado)
exports.ventasTotales = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sp_ventas_totales()');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener ventas totales:', error);
    res.status(500).json({ error: 'Error al obtener ventas totales' });
  }
};

// Ventas por fecha (procedimiento almacenado)
exports.ventasPorFecha = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  try {
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        error: 'Debe proporcionar fecha_inicio y fecha_fin' 
      });
    }

    const result = await pool.query(
      'SELECT * FROM sp_ventas_por_fecha($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ventas por fecha:', error);
    res.status(500).json({ error: 'Error al obtener ventas por fecha' });
  }
};

// Productos más vendidos (procedimiento almacenado)
exports.productosMasVendidos = async (req, res) => {
  const limite = req.query.limite || 10;

  try {
    const result = await pool.query(
      'SELECT * FROM sp_productos_mas_vendidos($1)',
      [limite]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ error: 'Error al obtener productos más vendidos' });
  }
};

// ===== REPORTES CON VISTAS =====

// Reporte de ventas (vista)
exports.reporteVentas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_reporte_ventas LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
};

// Inventario actual (vista)
exports.inventario = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_inventario');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
};

// Auditoría reciente (vista)
exports.auditoria = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_auditoria_reciente');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    res.status(500).json({ error: 'Error al obtener auditoría' });
  }
};
