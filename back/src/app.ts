import express from "express";
import cors from "cors";
import setorRoutes from "./routes/setorRoutes";
import documentoRoutes from "./routes/documentoRoutes";
import tramitacaoRoutes from "./routes/tramitacaoRoutes";
import tipoDocumentoRoutes from "./routes/tipoDocumentoRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/documentos", documentoRoutes);
app.use("/setores", setorRoutes);
app.use("/tipos-documento", tipoDocumentoRoutes);
app.use("/tramitacoes", tramitacaoRoutes);

export default app;
