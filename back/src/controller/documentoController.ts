import { Request, Response } from "express";
import prisma from "../models/prismaClient";

export const createDocumento = async (req: Request, res: Response) => {
  try {
    const { numero, titulo, descricao, arquivo, tipoDocumentoId } = req.body;

    const novoDocumento = await prisma.documento.create({
      data: { numero, titulo, descricao, arquivo, tipoDocumentoId },
    });

    res.status(201).json(novoDocumento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar documento" });
  }
};

export const getDocumentos = async (req: Request, res: Response) => {
  try {
    const documentos = await prisma.documento.findMany({
      include: { tipoDocumento: true },
    });
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
};
