import { getTipoDocumentos, createTipoDocumento } from './../controller/tipoeDocumentoController';
import { Router } from "express";

const router = Router();

router.get("/", getTipoDocumentos);
router.post("/", createTipoDocumento);

export default router;
