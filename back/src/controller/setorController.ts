import { Request, Response } from "express";
import prisma from "../models/prismaClient";

export const createSetor = async (req: Request, res: Response) => {
  const { sigla, descricao } = req.body;
  try {
    const setor = await prisma.setor.create({
      data: { sigla, descricao },
    });
    res.json(setor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar setor" });
  }
};

export const getSetores = async (req: Request, res: Response) => {
  try {
    const setores = await prisma.setor.findMany();
    res.json(setores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar setores" });
  }
};
