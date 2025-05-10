"use client";

import React, { useState } from 'react';

const EventRegisterPage = () => {
  const [formData, setFormData] = useState<{
    nome: string;
    local: string;
    descricao: string;
    data_inicio: string;
    data_final: string;
    cidade: string;
    estado: string;
    organizador_id: string;
    status: string;
    capa: string | File; // Permitir string ou File para o campo capa
  }>({
    nome: '',
    local: '',
    descricao: '',
    data_inicio: '',
    data_final: '',
    cidade: '',
    estado: '',
    organizador_id: '',
    status: 'ativo',
    capa: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log('Resposta do servidor:', responseData);

      if (response.ok) {
        alert('Evento cadastrado com sucesso!');
        setFormData({
          nome: '',
          local: '',
          descricao: '',
          data_inicio: '',
          data_final: '',
          cidade: '',
          estado: '',
          organizador_id: '',
          status: 'ativo',
          capa: '',
        });
      } else {
        alert(`Erro ao cadastrar evento: ${responseData.message || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar evento:', error);
      alert('Erro ao cadastrar evento.');
    }
  };

  return (
    <div>
      <h1>Cadastro de Evento</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <input type="text" name="local" placeholder="Local" value={formData.local} onChange={handleChange} required />
        <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required />
        <input type="datetime-local" name="data_inicio" placeholder="Data Início" value={formData.data_inicio} onChange={handleChange} required />
        <input type="datetime-local" name="data_final" placeholder="Data Final" value={formData.data_final} onChange={handleChange} required />
        <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} required />
        <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
        <input type="text" name="organizador_id" placeholder="ID do Organizador" value={formData.organizador_id} onChange={handleChange} required />
        <div className="flex flex-col gap-2">
          <label htmlFor="eventCover" className="text-sm font-medium text-gray-700">Capa do Evento</label>
          <input
            id="eventCover"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("event_id", "1"); // Substituir pelo ID real do evento, se disponível

                try {
                  const response = await fetch("http://localhost:5000/api/events/register", {
                    method: "POST",
                    body: formData,
                  });

                  if (response.ok) {
                    const data = await response.json();
                    setFormData((prevData) => ({ ...prevData, capa: data.path }));
                    alert("Capa enviada com sucesso!");
                  } else {
                    alert("Erro ao enviar a capa.");
                  }
                } catch (error) {
                  console.error("Erro ao fazer upload da capa:", error);
                }
              }
            }}
          />
        </div>
        <button type="submit">Cadastrar Evento</button>
      </form>
    </div>
  );
};

export default EventRegisterPage;