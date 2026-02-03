const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// CRUD de ventas
router.post('/', ventaController.create);
router.get('/', ventaController.getAll);
router.get('/:id', ventaController.getById);

// Reportes con procedimientos almacenados (solo admin)
router.get('/reportes/totales', esAdmin, ventaController.ventasTotales);
router.get('/reportes/por-fecha', esAdmin, ventaController.ventasPorFecha);
router.get('/reportes/mas-vendidos', esAdmin, ventaController.productosMasVendidos);

// Reportes con vistas (solo admin)
router.get('/reportes/ventas', esAdmin, ventaController.reporteVentas);
router.get('/reportes/inventario', esAdmin, ventaController.inventario);
router.get('/reportes/auditoria', esAdmin, ventaController.auditoria);

module.exports = router;
