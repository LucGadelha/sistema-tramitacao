import React, { useState, useEffect } from "react";
import { FaPaperclip } from "react-icons/fa";
import axios from "axios";

interface EditDocProps {
  documentoId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const FormEditDoc: React.FC<EditDocProps> = ({ documentoId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    numero: "",
    tipoDocumentoId: "",
    titulo: "",
    descricao: "",
    anexo: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tiposDocumento, setTiposDocumento] = useState<{ id: number; descricao: string }[]>([]); // Estado para armazenar tipos de documentos
  const [errors, setErrors] = useState({
    numero: "",
    tipoDocumentoId: "",
    titulo: "",
    descricao: "",
  });

  useEffect(() => {
    const fetchTiposDocumento = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tipos-documento");
        setTiposDocumento(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de documento:", error);
      }
    };

    fetchTiposDocumento();
  }, []);

  useEffect(() => {
  if (documentoId) {
    fetchDocumento();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [documentoId]);

  const fetchDocumento = async () => {
    try {

    const response = await axios.get(`http://localhost:3030/documentos/${documentoId}`);
    
    if (!response.data) {
      throw new Error("Documento não encontrado");
    }

    const { numero, titulo, descricao, tipoDocumentoId } = response.data;

    setFormData({ numero, tipoDocumentoId: tipoDocumentoId.toString(), titulo, descricao, anexo: null });
  } catch (error) {
    console.error("Erro ao carregar documento:", error);
    setMessage("Erro ao carregar documento.");
  }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, anexo: e.target.files[0] });
    }
  };

  const validateFields = () => {
    const newErrors = { numero: "", tipoDocumentoId: "", titulo: "", descricao: "", anexo: "" };
    let isValid = true;

    if (!formData.numero.trim()) {
      newErrors.numero = "O número do documento é obrigatório.";
      isValid = false;
    }
    if (!formData.tipoDocumentoId) {
      newErrors.tipoDocumentoId = "Selecione um tipo de documento.";
      isValid = false;
    }
    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório.";
      isValid = false;
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = "A descrição é obrigatória.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validação simples dos campos obrigatórios
    if (!validateFields()) {
      setLoading(false);
      return;
    }

    // Monta o FormData para enviar os dados
    const formDataToSend = new FormData();
    formDataToSend.append("numero", formData.numero);
    formDataToSend.append("tipoDocumentoId", formData.tipoDocumentoId);
    formDataToSend.append("titulo", formData.titulo);
    formDataToSend.append("descricao", formData.descricao);
    if (formData.anexo) {
      formDataToSend.append("file", formData.anexo);
    }

    try {
      await axios.put(`http://localhost:3030/documentos/${documentoId}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Documento atualizado com sucesso!");
      onUpdate(); // Atualiza a lista de documentos após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      setMessage("Erro ao atualizar documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Editar Documento</h2>

      {/* Número do Documento e Tipo de Documento */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          placeholder="Nº Documento"
          className={`border ${errors.numero ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 w-full`}
        />
        <select
          name="tipoDocumentoId"
          value={formData.tipoDocumentoId}
          onChange={handleChange}
          className={`border ${errors.tipoDocumentoId ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 w-full`}
        >
          <option value="">Tipo de Documento</option>
          {tiposDocumento.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.descricao}
            </option>
          ))}
        </select>
        {errors.tipoDocumentoId && <p className="text-red-500 text-sm">{errors.tipoDocumentoId}</p>}
      </div>

      {/* Título */}
      <input
        type="text"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Título"
        className={`border ${errors.titulo ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 w-full`}
      />

      {/* Descrição */}
      <textarea
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        placeholder="Descrição"
        className={`border ${errors.descricao ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 w-full h-24`}
      />

      {/* Anexo */}
      <label className="border border-gray-300 rounded-md px-3 py-2 w-full flex items-center gap-2 cursor-pointer">
        <FaPaperclip className="text-gray-500" />
        <span className="text-gray-600">{formData.anexo ? formData.anexo.name : "Anexo"}</span>
        <input type="file" name="anexo" onChange={handleFileChange} className="hidden" />
      </label>
      
      {/* Mensagem de sucesso ou erro */}
      {message && <p className="text-center text-sm">{message}</p>}

      {/* Botões */}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md">
          CANCELAR
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md" disabled={loading}>
          {loading ? "Salvando..." : "SALVAR ALTERAÇÕES"}
        </button>
      </div>
    </form>
  );
};

export default FormEditDoc;
