'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaFilePdf, FaPlus } from "react-icons/fa";
import Modal from "@/components/Modal"; // Modal reutilizável
import FormsCadDoc from "@/components/Forms/FormCadDoc";
import FormEditDoc from "@/components/Forms/FormEditDoc";
import FormsTramitacaoDoc from  "@/components/Forms/FormTramitacaoDoc";

const DocumentManager = () => {
  interface Documento {
    id: number;
    numero: string;
    titulo: string;
    setorEnvio?: { descricao: string };
    dataCadastro: string;
    setorRecebe?: { descricao: string };
    dataRecebimento?: string;
    arquivo: string;
    tipoDocumentoId?: string;
    descricao?: string;
  }

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<Documento | null>(null);

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const response = await axios.get("http://localhost:3030/documentos");
      setDocumentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar documentos", error);
    }
  };

  const handleOpenModal = (type: string, documento?: Documento) => {
    setModalType(type);
    if (type === "editar" && documento) {
      setDocumentoSelecionado(documento);
    } else {
      setDocumentoSelecionado(null);
    }
    setShowModal(true);
  };

  // Fechar o modal e resetar seleção
  const fecharModal = () => {
    setShowModal(false);
    setDocumentoSelecionado(null);
  };

  // Atualiza a lista de documentos
  const atualizarLista = () => {
    fetchDocumentos();
  };

  const handleDeleteDocumento = async (id: number) => {
  const confirmDelete = window.confirm("Tem certeza que deseja deletar este documento?");
  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:3030/documentos/${id}`);
      // Atualiza a lista de documentos após a exclusão
      atualizarLista();
    } catch (error) {
      console.error("Erro ao deletar documento", error);
      alert("Erro ao deletar documento. Tente novamente.");
    }
  }
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">GERENCIAMENTO DE DOCUMENTOS</h2>
        <div className="flex justify-between">
          <button
            onClick={() => handleOpenModal("cadastrar")}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4 flex items-center gap-2">
            <FaPlus /> Cadastrar
          </button>
          <button 
            onClick={() => handleOpenModal("tramitacao")} 
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 flex items-center gap-2">
            <FaPlus /> Tramitação Documento
          </button>
        </div>

        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Nº Documento</th>
              <th className="py-3 px-6 text-left">Título</th>
              <th className="py-3 px-6 text-left">Setor Envio</th>
              <th className="py-3 px-6 text-left">Data Hora Envio</th>
              <th className="py-3 px-6 text-left">Setor Recebimento</th>
              <th className="py-3 px-6 text-left">Data Hora Recebimento</th>
              <th className="py-3 px-6 text-left">Anexo</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {documentos.map((doc) => (
              <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{doc.numero}</td>
                <td className="py-3 px-6">{doc.titulo}</td>
                <td className="py-3 px-6">{doc.setorEnvio?.descricao || '-'}</td>
                <td className="py-3 px-6">{new Date(doc.dataCadastro).toLocaleString()}</td>
                <td className="py-3 px-6">{doc.setorRecebe?.descricao || '-'}</td>
                <td className="py-3 px-6">{doc.dataRecebimento ? new Date(doc.dataRecebimento).toLocaleString() : '-'}</td>
                <td className="py-3 px-6">
                  <a href={`http://localhost:3030/documentos/${doc.id}/download`} target="_blank" rel="noopener noreferrer">
                    <FaFilePdf className="text-red-600 text-lg" />
                  </a>
                </td>
                <td className="py-3 px-6 text-center flex gap-2 justify-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800" 
                    onClick={() => handleOpenModal("editar", doc)}
                  >
                    <FaEdit />
                  </button>
                  <button 
  className="text-red-600 hover:text-red-800" 
  onClick={() => handleDeleteDocumento(doc.id)}
>
  <FaTrash />
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para cadastro, edição ou tramitação de documento */}
      {showModal && (
        <Modal 
          title={
            modalType === "cadastrar" ? "Cadastrar Documento" 
            : modalType === "editar" ? "Editar Documento" 
            : "Tramitação de Documento"
          } 
          onClose={fecharModal}
        >
          {modalType === "cadastrar" ? (
            <FormsCadDoc onClose={fecharModal} onUpdate={atualizarLista} />
          ) : modalType === "editar" && documentoSelecionado ? (
            <FormEditDoc documentoId={documentoSelecionado?.id} onClose={fecharModal} onUpdate={atualizarLista} />
          ) : modalType === "tramitacao" ? (
            <FormsTramitacaoDoc onClose={fecharModal} onUpdate={atualizarLista} />
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default DocumentManager;
