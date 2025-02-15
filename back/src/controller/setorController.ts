import { Request, Response } from "express";
import prisma from "../models/prismaClient";

export const createSetor = async (req: Request, res: Response) => {
  try {
    const { sigla, descricao } = req.body;
    const setor = await prisma.setor.create({ data: { sigla, descricao } });
    res.json(setor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar setor" });
  }
};

export const getSetores = async (_req: Request, res: Response) => {
  try {
    const setores = await prisma.setor.findMany();
    
    // Transformando os dados para corresponder ao que o frontend espera
    const setoresFormatados = setores.map((setor) => ({
      id: setor.id,
      nome: setor.descricao, // Usando 'descricao' como 'nome'
    }));

    res.json(setoresFormatados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar setores" });
  }
};

export const updateSetor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedSetor = await prisma.setor.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(updatedSetor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar setor" });
  }
};

export const deleteSetor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.setor.delete({ where: { id: Number(id) } });
    res.json({ message: "Setor deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar setor" });
  }
};