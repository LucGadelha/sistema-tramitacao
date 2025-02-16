'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface TipoDocumento {
  id: number;
  descricao: string;
}

export default function TiposDocumentoPage() {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTiposDocumento = async () => {
    try {
      const response = await axios.get('http://localhost:3030/tipos-documento');
      setTiposDocumento(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de documento', error);
    }
  };

  useEffect(() => {
    fetchTiposDocumento();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3030/tipos-documento/${editingId}`, { descricao });
      } else {
        await axios.post('http://localhost:3030/tipos-documento', { descricao });
      }
      setDescricao('');
      setEditingId(null);
      fetchTiposDocumento();
    } catch (error) {
      console.error('Erro ao salvar tipo de documento', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3030/tipos-documento/${id}`);
      fetchTiposDocumento();
    } catch (error) {
      console.error('Erro ao deletar tipo de documento', error);
    }
  };

  const handleEdit = (tipo: TipoDocumento) => {
    setDescricao(tipo.descricao);
    setEditingId(tipo.id);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Tipos de Documento</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>
      <ul>
        {tiposDocumento.map((tipo) => (
          <li key={tipo.id} className="flex justify-between items-center border p-2 mb-2 rounded">
            <span>{tipo.descricao}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(tipo)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(tipo.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
