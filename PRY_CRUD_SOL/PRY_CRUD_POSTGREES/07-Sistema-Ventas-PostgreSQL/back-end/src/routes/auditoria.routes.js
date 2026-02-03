const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoria.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

router.get('/', auditoriaController.getAll);
router.get('/reciente', auditoriaController.getReciente);
router.get('/triggers', auditoriaController.getTriggers);

module.exports = router;
