import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import fs from "fs";
import path from "path";

export const createDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { numero, titulo, descricao, tipoDocumentoId } = req.body;

    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo enviado" });
      return;
    }

    // Validação do tipoDocumentoId
    const tipoId = Number(tipoDocumentoId);
    if (isNaN(tipoId)) {
      res.status(400).json({ error: "tipoDocumentoId inválido" });
      return;
    }

    // Caminho relativo do arquivo salvo
    const filePath = `uploads/${req.file.filename}`;

    // Criar documento no banco de dados
    const novoDocumento = await prisma.documento.create({
      data: {
        numero,
        titulo,
        descricao,
        arquivo: filePath,
        tipoDocumentoId: tipoId,
      },
    });

    res.status(201).json(novoDocumento);
  } catch (error) {
    console.error("Erro ao criar documento:", error);
    res.status(500).json({ error: "Erro ao criar documento" });
  }
};

export const getDocumentos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const documentos = await prisma.documento.findMany({
      include: { tipoDocumento: true },
    });
    res.json(documentos);
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
};

export const getDocumentoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id: Number(id) },
    });

    if (!documento) {
      res.status(404).json({ error: "Documento não encontrado" });
      return;
    }

    res.json(documento);
  } catch (error) {
    console.error("Erro ao buscar documento por ID:", error);
    res.status(500).json({ error: "Erro ao buscar documento" });
  }
};

export const getDocumentoFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id: Number(id) },
    });

    if (!documento) {
      res.status(404).json({ error: "Documento não encontrado" });
      return;
    }

    const filePath = path.join(__dirname, "../../", documento.arquivo);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Arquivo não encontrado" });
      return;
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Erro ao buscar arquivo:", error);
    res.status(500).json({ error: "Erro ao buscar arquivo" });
  }
};

export const updateDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Buscar documento existente
    const documentoExistente = await prisma.documento.findUnique({
      where: { id: Number(id) },
    });

    if (!documentoExistente) {
      res.status(404).json({ error: "Documento não encontrado" });
      return;
    }

    // Criar objeto de atualização sem sobrescrever o campo "arquivo" caso nenhum novo arquivo seja enviado
    const updatedData: any = { 
      numero: req.body.numero ?? documentoExistente.numero,
      titulo: req.body.titulo ?? documentoExistente.titulo,
      descricao: req.body.descricao ?? documentoExistente.descricao,
      tipoDocumentoId: req.body.tipoDocumentoId ? Number(req.body.tipoDocumentoId) : documentoExistente.tipoDocumentoId,
      arquivo: documentoExistente.arquivo, // Mantém o mesmo arquivo por padrão
    };

    if (req.file) {
      const newFilePath = `uploads/${req.file.filename}`;

      // Remover arquivo antigo se houver um novo
      if (documentoExistente.arquivo) {
        const oldFilePath = path.join(__dirname, "../../", documentoExistente.arquivo);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Atualizar o caminho do arquivo
      updatedData.arquivo = newFilePath;
    }

    // Atualizar documento no banco de dados
    const updatedDocumento = await prisma.documento.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    res.json(updatedDocumento);
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
    res.status(500).json({ error: "Erro ao atualizar documento" });
  }
};

export const deleteDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.documento.delete({ where: { id: Number(id) } });

    res.json({ message: "Documento deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar documento:", error);
    res.status(500).json({ error: "Erro ao deletar documento" });
  }
};