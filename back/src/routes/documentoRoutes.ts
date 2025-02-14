import { Router } from "express";
import { 
  getDocumentos, 
  createDocumento, 
  updateDocumento, 
  deleteDocumento, 
  getDocumentoFile, 
  getDocumentoById
} from "../controller/documentoController";
import upload from "../config/multerConfig";

const router = Router();

router.post("/", upload.single("file"), createDocumento);
router.get("/", getDocumentos);
router.get("/:id/download", getDocumentoFile);
router.put("/:id", upload.single("file"), updateDocumento);
router.delete("/:id", deleteDocumento);
router.get("/:id", getDocumentoById);

export default router;