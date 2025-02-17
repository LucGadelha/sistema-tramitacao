import React, { useState, useEffect } from "react";
import { FaPaperclip } from "react-icons/fa";
import axios from "axios";

interface FormsCadDocProps {
  onClose: () => void;
  onUpdate: () => void;
}

const FormsCadDoc: React.FC<FormsCadDocProps> = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    numero: "",
    tipoDocumentoId: "",
    titulo: "",
    descricao: "",
    anexo: null as File | null,
  });

  const [errors, setErrors] = useState({
    numero: "",
    tipoDocumentoId: "",
    titulo: "",
    descricao: "",
    anexo: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tiposDocumento, setTiposDocumento] = useState<{ id: number; descricao: string }[]>([]);

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
    if (!formData.anexo) {
      newErrors.anexo = "O anexo é obrigatório.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, anexo: e.target.files[0] });
      setErrors({ ...errors, anexo: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("numero", formData.numero);
    formDataToSend.append("tipoDocumentoId", formData.tipoDocumentoId);
    formDataToSend.append("titulo", formData.titulo);
    formDataToSend.append("descricao", formData.descricao);
    if (formData.anexo) {
      formDataToSend.append("file", formData.anexo);
    }

    try {
      await axios.post("http://localhost:3030/documentos", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Documento cadastrado com sucesso!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar documento:", error);
      setMessage("Erro ao cadastrar documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            placeholder="Nº Documento"
            className="border rounded px-3 py-2 w-full"
          />
          {errors.numero && <p className="text-red-500 text-sm">{errors.numero}</p>}
        </div>

        <div>
          <select
            name="tipoDocumentoId"
            value={formData.tipoDocumentoId}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
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
      </div>

      <div>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo}</p>}
      </div>

      <div>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descrição"
          className="border rounded px-3 py-2 w-full h-24"
        />
        {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao}</p>}
      </div>

      <div>
        <label className="border rounded px-3 py-2 w-full flex items-center gap-2 cursor-pointer">
          <FaPaperclip className="text-gray-500" />
          <span className="text-gray-600">{formData.anexo ? formData.anexo.name : "Anexo"}</span>
          <input type="file" name="anexo" onChange={handleFileChange} className="hidden" />
        </label>
        {errors.anexo && <p className="text-red-500 text-sm">{errors.anexo}</p>}
      </div>

      {message && <p className="text-center text-sm">{message}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" className="px-4 py-2 border rounded text-gray-600" onClick={onClose}>
          CANCELAR
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 text-white"}`}
          disabled={loading}
        >
          {loading ? "Salvando..." : "SALVAR"}
        </button>
      </div>
    </form>
  );
};

export default FormsCadDoc;
