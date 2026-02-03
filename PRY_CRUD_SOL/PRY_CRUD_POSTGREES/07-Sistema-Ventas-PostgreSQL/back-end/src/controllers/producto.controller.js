const pool = require('../config/database');

// ===== CRUD DE PRODUCTOS CON PROCEDIMIENTOS ALMACENADOS =====

// Obtener todos los productos
exports.getAll = async (req, res) => {
  try {
    const { limit, page = 1 } = req.query;
    
    if (limit) {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        'SELECT * FROM productos WHERE activo = true ORDER BY id LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM productos WHERE activo = true'
      );
      const total = parseInt(countResult.rows[0].count);
      
      res.json({
        productos: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else {
      const result = await pool.query(
        'SELECT * FROM productos WHERE activo = true ORDER BY id'
      );
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1 AND activo = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear producto (usando procedimiento almacenado)
exports.create = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;

  try {
    // Validación
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    // Llamar al procedimiento almacenado
    const result = await pool.query(
      'SELECT sp_crear_producto($1, $2, $3, $4) as id',
      [nombre, descripcion || '', precio, stock || 0]
    );

    const newId = result.rows[0].id;

    // Obtener el producto creado
    const producto = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [newId]
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: producto.rows[0]
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Actualizar producto (usando procedimiento almacenado)
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;

  try {
    // Validación
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    // Llamar al procedimiento almacenado
    const result = await pool.query(
      'SELECT sp_actualizar_producto($1, $2, $3, $4, $5) as actualizado',
      [id, nombre, descripcion || '', precio, stock || 0]
    );

    if (!result.rows[0].actualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Obtener el producto actualizado
    const producto = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    res.json({
      message: 'Producto actualizado exitosamente',
      producto: producto.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto (usando procedimiento almacenado - soft delete)
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    // Llamar al procedimiento almacenado
    const result = await pool.query(
      'SELECT sp_eliminar_producto($1) as eliminado',
      [id]
    );

    if (!result.rows[0].eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
