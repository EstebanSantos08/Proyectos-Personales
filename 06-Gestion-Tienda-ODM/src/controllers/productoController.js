import { Producto } from "../models/producto.js";
//crear producto
export const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}      
//listar productos
export const ObtenerProductos = async (req, res) => {
    try {
        const lista = await Producto.find();
        res.status(200).json(lista);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}
//obtener producto por id
export const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }   
}
//actualizar producto
export const actualizarProducto = async (req, res) => {
    const productoActualizado = await Producto.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!productoActualizado) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(productoActualizado);
}
//eliminar producto
export const eliminarProducto = async (req, res) => {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json({ mensaje: "Producto eliminado" });

}
export default {
    crearProducto,
    ObtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
