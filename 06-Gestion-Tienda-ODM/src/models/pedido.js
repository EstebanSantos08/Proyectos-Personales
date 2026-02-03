import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  fecha : { type: Date, required: true },
  //referenciando productos por su ObjectId
    productos: [{ 
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
        cantidad: { type: Number, required: true }
    }],
    total: { type: Number, default: 0 }
    
}, { timestamps: true, collection: "pedido" });

export const Pedido = mongoose.model("Pedido", pedidoSchema);

