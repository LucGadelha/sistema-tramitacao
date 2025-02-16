'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Setor {
  id: number;
  sigla: string;
  descricao: string;
}

export default function SetoresPage() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [sigla, setSigla] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSetores = async () => {
    try {
      const response = await axios.get('http://localhost:3030/setores');
      setSetores(response.data);
    } catch (error) {
      console.error('Erro ao buscar setores', error);
    }
  };

  useEffect(() => {
    fetchSetores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3030/setores/${editingId}`, { sigla, descricao });
      } else {
        await axios.post('http://localhost:3030/setores', { sigla, descricao });
      }
      setSigla('');
      setDescricao('');
      setEditingId(null);
      fetchSetores();
    } catch (error) {
      console.error('Erro ao salvar setor', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3030/setores/${id}`);
      fetchSetores();
    } catch (error) {
      console.error('Erro ao deletar setor', error);
    }
  };

  const handleEdit = (setor: Setor) => {
    setSigla(setor.sigla);
    setDescricao(setor.descricao);
    setEditingId(setor.id);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Setores</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Sigla"
          value={sigla}
          onChange={(e) => setSigla(e.target.value)}
          className="p-2 border rounded"
          required
        />
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
        {setores.map((setor) => (
  <li key={setor.id} className="flex justify-between items-center border p-2 mb-2 rounded">
    <span>{setor.sigla} - {setor.descricao}</span>
    <div className="flex gap-2">
      <button
        onClick={() => handleEdit(setor)}
        className="bg-yellow-500 text-white p-2 rounded"
      >
        Editar
      </button>
      <button
        onClick={() => handleDelete(setor.id)}
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