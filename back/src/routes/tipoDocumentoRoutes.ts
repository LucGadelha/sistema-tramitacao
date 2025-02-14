import { getTipoDocumentos, createTipoDocumento, updateTipoDocumento, deleteTipoDocumento } from "../controller/tipoDocumentoController";
import { Router } from "express";

const router = Router();

router.get("/", getTipoDocumentos);
router.post("/", createTipoDocumento);
router.put("/:id", updateTipoDocumento);
router.delete("/:id", deleteTipoDocumento);

export default router;
