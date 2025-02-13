import express from 'express';
import { getTramitacoes, createTramitacao } from './../controller/tramitacaoController';

const router = express.Router();

router.post('/', createTramitacao);
router.get('/', getTramitacoes);

export default router;
