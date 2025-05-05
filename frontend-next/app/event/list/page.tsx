"use client";

import React, { useEffect, useState } from "react";

export default function EventList() {
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

  return (
    <div>
      <h1>Eventos Cadastrados</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data Início</th>
            <th>Data Final</th>
            <th>Local</th>
            <th>Organizador</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.nome}</td>
              <td>{new Date(event.data_inicio).toLocaleString()}</td>
              <td>{new Date(event.data_final).toLocaleString()}</td>
              <td>{event.local}</td>
              <td>{event.organizador_id}</td>
              <td>{event.descricao}</td>
              <td>{event.status}</td>
              <td>
                <button onClick={() => window.location.href = `/event/edit?id=${event.id}`}>Editar</button>
              </td>
              <td>
                <button
                  onClick={() => {
                    if (event.id) {
                      window.location.href = `/event/details?id=${encodeURIComponent(event.id)}`;
                    } else {
                      console.error("Evento sem ID:", event);
                      alert("ID do evento não encontrado. Verifique os dados do evento.");
                    }
                  }}
                >
                  Ver Ingressos
                </button>
              </td>
              <td>
                <button onClick={() => window.location.href = `/ticket/register?evento_id=${event.id}`}>Cadastrar Ingresso</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}