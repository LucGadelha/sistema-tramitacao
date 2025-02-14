import { Router, Request, Response, NextFunction } from "express";
import { createTramitacao, getTramitacoes, deleteTramitacao, registrarRecebimento } from "../controller/tramitacaoController";

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post("/", asyncHandler(createTramitacao));
router.get("/", asyncHandler(getTramitacoes));
router.put("/:id/receber", asyncHandler(registrarRecebimento));
router.delete("/:id", asyncHandler(deleteTramitacao));

export default router;