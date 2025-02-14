import { getSetores, createSetor, updateSetor, deleteSetor } from "../controller/setorController";
import { Router } from "express";

const router = Router();

router.get("/", getSetores);
router.post("/", createSetor);
router.put("/:id", updateSetor);
router.delete("/:id", deleteSetor);

export default router;
