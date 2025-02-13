import express from "express";
import cors from "cors";
import setorRoutes from "./routes/setorRoutes";
import documentoRoutes from "./routes/documentoRoutes";
import tramitacaoRoutes from "./routes/tramitacaoRoutes";
import tipoDocumentosRoutes from "./routes/tipoDocumentoRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/setores", setorRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/tramitacoes", tramitacaoRoutes);
app.use("/api/tipos-documento", tipoDocumentosRoutes);

export default app;
