import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productoRoutes from "./src/routes/productoRoutes.js";
import pedidoRoutes from "./src/routes/pedidoRoutes.js";
import { connectToMongo } from "./src/config/mongo.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", productoRoutes);
app.use("/api", pedidoRoutes);

await connectToMongo();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
export default app; 