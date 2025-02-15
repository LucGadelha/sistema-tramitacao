import React, { useState, useEffect } from "react";
import axios from "axios";

interface FormsTramitacaoDocProps {
  onClose: () => void;
  onUpdate: () => void;
}

const FormsTramitacaoDoc: React.FC<FormsTramitacaoDocProps> = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    documentoId: "",
    setorEnvioId: "",
    setorRecebeId: "",
  });

  const [documentos, setDocumentos] = useState<{ id: number; titulo: string }[]>([]);
  const [setores, setSetores] = useState<{ id: number; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, setoresRes] = await Promise.all([
          axios.get("http://localhost:3030/documentos"),
          axios.get("http://localhost:3030/setores"),
        ]);
        setDocumentos(docsRes.data);
        setSetores(setoresRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.setorEnvioId === formData.setorRecebeId) {
      setMessage("O setor de envio não pode ser o mesmo que o setor de recebimento.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3030/tramitacoes", {
      documentoId: Number(formData.documentoId),
      setorEnvioId: Number(formData.setorEnvioId),
      setorRecebeId: Number(formData.setorRecebeId),
    });
      setMessage("Tramitação registrada com sucesso!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao registrar tramitação:", error);
      setMessage("Erro ao registrar tramitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Nova Tramitação</h2>

      {/* Selecionar Documento */}
      <select name="documentoId" value={formData.documentoId} onChange={handleChange} className="border rounded px-3 py-2 w-full">
        <option value="">Selecione um Documento</option>
        {documentos.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.titulo}
          </option>
        ))}
      </select>

      {/* Selecionar Setor de Envio */}
      <select name="setorEnvioId" value={formData.setorEnvioId} onChange={handleChange} className="border rounded px-3 py-2 w-full">
        <option value="">Selecione o Setor de Envio</option>
        {setores.map((setor) => (
          <option key={setor.id} value={setor.id}>
            {setor.nome}
          </option>
        ))}
      </select>

      {/* Selecionar Setor de Recebimento */}
      <select name="setorRecebeId" value={formData.setorRecebeId} onChange={handleChange} className="border rounded px-3 py-2 w-full">
        <option value="">Selecione o Setor de Recebimento</option>
        {setores.map((setor) => (
          <option key={setor.id} value={setor.id}>
            {setor.nome}
          </option>
        ))}
      </select>

      {message && <p className="text-center text-sm text-red-500">{message}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" className="px-4 py-2 border rounded text-gray-600" onClick={onClose}>
          CANCELAR
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? "Salvando..." : "SALVAR"}
        </button>
      </div>
    </form>
  );
};

export default FormsTramitacaoDoc;
