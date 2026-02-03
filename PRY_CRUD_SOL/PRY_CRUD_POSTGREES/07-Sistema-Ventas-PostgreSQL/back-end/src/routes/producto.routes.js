const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);

// Rutas protegidas - Solo admin
router.post('/', verificarToken, esAdmin, productoController.create);
router.put('/:id', verificarToken, esAdmin, productoController.update);
router.delete('/:id', verificarToken, esAdmin, productoController.delete);

module.exports = router;
