import { Router } from "express";
import {
    crearProducto,
    ObtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
 } from "../controllers/productoController.js";
const router = Router();

// Rutas para productos
router.get("/productos", ObtenerProductos);
router.post("/productos", crearProducto);
router.get("/productos/:id", obtenerProductoPorId);
router.put("/productos/:id", actualizarProducto);
router.delete("/productos/:id", eliminarProducto);
export default router;
