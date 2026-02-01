import { Router } from "express";
import {
    crearPedido,
    ObtenerPedidos,
    obtenerPedidoPorId,
    actualizarPedido,
    eliminarPedido,
    calcularTotalPedido
} from "../controllers/pedidoController.js";
const router = Router();
// Rutas para pedidos
router.get("/pedidos", ObtenerPedidos);
router.post("/pedidos", crearPedido);
router.get("/pedidos/:id/total", calcularTotalPedido);
router.get("/pedidos/:id", obtenerPedidoPorId);
router.put("/pedidos/:id", actualizarPedido);
router.delete("/pedidos/:id", eliminarPedido);
export default router;
