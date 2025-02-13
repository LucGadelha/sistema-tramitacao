import { getDocumentos, createDocumento } from './../controller/documentoController';
import { Router } from "express"; 

const router = Router();

router.get("/", getDocumentos);
router.post("/", createDocumento);

export default router;
