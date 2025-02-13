import { Request, Response } from "express";
import prisma from '../models/prismaClient';

export const getTipoDocumentos = async (req: Request, res: Response) => {
  try {
    const tipos = await prisma.tipoDocumento.findMany();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tipos de documento" });
  }
};

export const createTipoDocumento = async (req: Request, res: Response) => {
  try {
    const { descricao } = req.body;
    const novoTipo = await prisma.tipoDocumento.create({
      data: { descricao },
    });
    res.status(201).json(novoTipo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tipo de documento" });
  }
};
