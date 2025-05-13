"use client";

import React, { useState, useEffect } from "react";

export default function TicketRegister() {
  const [formData, setFormData] = useState({
    evento_id: "",
    tipo: "",
    preco: "",
    quantidade_disponivel: "",
    data_inicio: "",
    data_final: "",
  });
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:5000/events");
        if (!response.ok) {
          throw new Error("Erro ao buscar eventos");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar eventos.");
      }
    }
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Ingresso cadastrado com sucesso!");
        setFormData({ evento_id: "", tipo: "", preco: "", quantidade_disponivel: "", data_inicio: "", data_final: "" });
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar ingresso:", error);
      alert("Erro ao cadastrar ingresso. Tente novamente mais tarde.");
    }
  };

  return (
    <div>
      <h1>Cadastro de Ingresso</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="evento_id">Evento:</label>
        <select id="evento_id" name="evento_id" value={formData.evento_id} onChange={handleChange} required>
          <option value="">Selecione um evento</option>
          {events.map((event) => (
            <option key={event.id} value={event.id} onClick={() => window.location.href = `/event/details?id=${event.nome}`}>{event.nome}</option>
          ))}
        </select>
        <br />
        <label htmlFor="tipo">Tipo de Ingresso:</label>
        <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value="">Selecione o tipo</option>
          <option value="unitario">Unitário</option>
          <option value="multiplo">Múltiplo</option>
        </select>
        <br />
        <label htmlFor="preco">Preço:</label>
        <input type="number" id="preco" name="preco" value={formData.preco} onChange={handleChange} required />
        <br />
        <label htmlFor="quantidade_disponivel">Quantidade Disponível:</label>
        <input type="number" id="quantidade_disponivel" name="quantidade_disponivel" value={formData.quantidade_disponivel} onChange={handleChange} required />
        <br />
        <label htmlFor="data_inicio">Data de Início:</label>
        <input type="datetime-local" id="data_inicio" name="data_inicio" value={formData.data_inicio} onChange={handleChange} required />
        <br />
        <label htmlFor="data_final">Data Final:</label>
        <input type="datetime-local" id="data_final" name="data_final" value={formData.data_final} onChange={handleChange} required />
        <br />
        <button type="submit">Cadastrar Ingresso</button>
      </form>
    </div>
  );
}