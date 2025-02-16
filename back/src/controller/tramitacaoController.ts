import { Request, Response } from "express";
import prisma from "../models/prismaClient";

export const createTramitacao = async (req: Request, res: Response) => {
  try {
    const { documentoId, setorEnvioId, setorRecebeId } = req.body;

    // Verificar se o setor de envio é diferente do setor de recebimento
    if (setorEnvioId === setorRecebeId) {
      return res.status(400).json({ error: "O setor de envio não pode ser o mesmo que o setor de recebimento" });
    }

    // Verificar se o documento foi enviado previamente ou se é o primeiro envio
    const tramitacoes = await prisma.tramitacaoDocumento.findMany({
      where: { documentoId },
      orderBy: { createdAt: 'asc' }
    });

    if (tramitacoes.length > 0) {
      const ultimaTramitacao = tramitacoes[tramitacoes.length - 1];
      if (!ultimaTramitacao.recebido) {
        return res.status(400).json({ error: "O documento só pode ser enviado se estiver marcado como recebido" });
      }
    }

    const tramitacao = await prisma.tramitacaoDocumento.create({
      data: { documentoId, setorEnvioId, setorRecebeId },
    });
    res.json(tramitacao);
  } catch (error) {
    console.error("Erro ao registrar tramitação:", error);
    res.status(500).json({ error: "Erro ao registrar tramitação" });
  }
};

export const registrarRecebimento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Recebendo tramitação com id: ${id}`);

    const tramitacao = await prisma.tramitacaoDocumento.findUnique({ where: { id: Number(id) } });
    if (!tramitacao) {
      return res.status(404).json({ error: "Tramitação não encontrada" });
    }

    if (tramitacao.recebido) {
      return res.status(400).json({ error: "Tramitação já está marcada como recebida" });
    }

    const updatedTramitacao = await prisma.tramitacaoDocumento.update({
      where: { id: Number(id) },
      data: { recebido: true },
    });

    res.json(updatedTramitacao);
  } catch (error) {
    console.error("Erro ao registrar recebimento:", error);
    res.status(500).json({ error: "Erro ao registrar recebimento" });
  }
};

export const getTramitacoes = async (_req: Request, res: Response) => {
  try {
    const tramitacoes = await prisma.tramitacaoDocumento.findMany({
      include: { documento: true, setorEnvio: true, setorRecebe: true },
    });
    res.json(tramitacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar tramitações" });
  }
};

export const deleteTramitacao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.tramitacaoDocumento.delete({ where: { id: Number(id) } });
    res.json({ message: "Tramitação deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar tramitação" });
  }
};