import { Pedido } from "../models/pedido.js";
import { Producto } from "../models/producto.js";

//crear pedido
export const crearPedido = async (req, res) => {
    try {
        const nuevoPedido = new Pedido(req.body);
        
        // Calcular el total
        let total = 0;
        for (const item of nuevoPedido.productos) {
            const producto = await Producto.findById(item.producto);
            if (producto) {
                total += producto.precio * item.cantidad;
            }
        }
        nuevoPedido.total = total;
        
        const pedidoGuardado = await nuevoPedido.save();
        // Poblar los productos para mostrar toda la información
        await pedidoGuardado.populate("productos.producto");
        res.status(201).json(pedidoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}      
//listar pedidos
export const ObtenerPedidos = async (req, res) => {
    try {
        const lista = await Pedido.find().populate("productos.producto");
        res.status(200).json(lista);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}
//obtener pedido por id
export const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate("productos.producto");
        if (!pedido) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }
        res.status(200).json(pedido);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }   
}
//actualizar pedido
export const actualizarPedido = async (req, res) => {
    try {
        // Si se actualizan los productos, recalcular el total
        if (req.body.productos) {
            let total = 0;
            for (const item of req.body.productos) {
                const producto = await Producto.findById(item.producto);
                if (producto) {
                    total += producto.precio * item.cantidad;
                }
            }
            req.body.total = total;
        }
        
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            req.params.id,      
            req.body,
            { new: true }
        ).populate("productos.producto");
        
        if (!pedidoActualizado) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }
        res.status(200).json(pedidoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}
//eliminar pedido
export const eliminarPedido = async (req, res) => {
    try {
        const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
        if (!pedidoEliminado) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }
        res.status(200).json({ mensaje: "Pedido eliminado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}
//funcion para calcular el total de un pedido
export const calcularTotalPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate("productos.producto");
        if (!pedido) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }
        const total = pedido.productos.reduce((suma, item) => suma + (item.producto.precio * item.cantidad), 0);
        res.status(200).json({ total });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}

export default {
    crearPedido,
    ObtenerPedidos,
    obtenerPedidoPorId,
    actualizarPedido,
    eliminarPedido,
    calcularTotalPedido
};
