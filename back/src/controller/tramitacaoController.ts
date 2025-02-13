import { Request, Response } from 'express';
import prisma from '../models/prismaClient';

// Função para registrar tramitação
export const createTramitacao = async (req: Request, res: Response) => {
  const { documentoId, setorEnvioId, setorRecebeId } = req.body;
  try {
    const tramitacao = await prisma.tramitacaoDocumento.create({
      data: {
        documentoId,
        setorEnvioId,
        setorRecebeId,
      },
    });
    res.json(tramitacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar tramitação' });
  }
};

// Função para consultar tramitações
export const getTramitacoes = async (req: Request, res: Response) => {
  try {
    const tramitacoes = await prisma.tramitacaoDocumento.findMany({
      include: {
        documento: true,
        setorEnvio: true,
        setorRecebe: true,
      },
    });
    res.json(tramitacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar tramitações' });
  }
};
