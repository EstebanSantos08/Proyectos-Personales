const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  
  try {
    // Validar campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, hashedPassword, rol || 'usuario']
    );

    const user = result.rows[0];

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'secreto_jwt',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener perfil
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, fecha_registro FROM usuarios WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
