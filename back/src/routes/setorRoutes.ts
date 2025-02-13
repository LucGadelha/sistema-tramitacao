import express from 'express';
import { getSetores, createSetor } from './../controller/setorController';

const router = express.Router();

router.post('/', createSetor);
router.get('/', getSetores);

export default router;
