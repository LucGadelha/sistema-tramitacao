import { Request, Response } from "express";
import prisma from '../models/prismaClient';

export const createTipoDocumento = async (req: Request, res: Response) => {
  try {
    const { descricao } = req.body;
    console.log(`Tentando criar tipo de documento com descrição: ${descricao}`);
    const novoTipo = await prisma.tipoDocumento.create({ data: { descricao } });
    res.status(201).json(novoTipo);
  } catch (error) {
    console.error("Erro ao criar tipo de documento:", error);
    res.status(500).json({ error: "Erro ao criar tipo de documento" });
  }
};

export const getTipoDocumentos = async (_req: Request, res: Response) => {
  try {
    const tipos = await prisma.tipoDocumento.findMany();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tipos de documento" });
  }
};

export const updateTipoDocumento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTipo = await prisma.tipoDocumento.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(updatedTipo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar tipo de documento" });
  }
};

export const deleteTipoDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Tentando deletar tipo de documento com ID: ${id}`);

    const tipoDocumento = await prisma.tipoDocumento.findUnique({ where: { id: Number(id) } });
    if (!tipoDocumento) {
      console.log(`Tipo de documento com ID: ${id} não encontrado`);
      res.status(404).json({ error: "Tipo de documento não encontrado" });
      return;
    }

    // Deletar documentos que referenciam este tipo de documento
    await prisma.documento.deleteMany({ where: { tipoDocumentoId: Number(id) } });

    await prisma.tipoDocumento.delete({ where: { id: Number(id) } });
    console.log(`Tipo de documento com ID: ${id} deletado com sucesso`);

    res.json({ message: "Tipo de documento deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar tipo de documento:", error);
    res.status(500).json({ error: "Erro ao deletar tipo de documento" });
  }
};