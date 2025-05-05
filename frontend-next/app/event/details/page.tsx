"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function EventDetails() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") || ""; // Garante que id seja uma string vazia se for null

  const [event, setEvent] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [userType, setUserType] = useState<string>("participante");

  useEffect(() => {
    if (!id) {
      alert("ID do evento não encontrado. Redirecionando para a lista de eventos.");
      window.location.href = "/event/list";
      return;
    }

    async function fetchEventDetails() {
      try {
        const eventResponse = await fetch(`http://localhost:5000/events/${encodeURIComponent(id)}`);
        if (!eventResponse.ok) {
          throw new Error("Erro ao buscar detalhes do evento");
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);

        const ticketsResponse = await fetch(`http://localhost:5000/events/${encodeURIComponent(id)}/tickets`);
        if (!ticketsResponse.ok) {
          throw new Error("Erro ao buscar ingressos do evento");
        }
        const ticketsData = await ticketsResponse.json();
        setTickets(ticketsData);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar detalhes do evento e ingressos.");
      }
    }

    fetchEventDetails();
  }, [id]);

  if (!event) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Detalhes do Evento</h1>
      <h2>{event.nome}</h2>
      <p><strong>Descrição:</strong> {event.descricao}</p>
      <p><strong>Data de Início:</strong> {new Date(event.data_inicio).toLocaleString()}</p>
      <p><strong>Data Final:</strong> {new Date(event.data_final).toLocaleString()}</p>
      <p><strong>Local:</strong> {event.local}</p>
      <p><strong>Organizador:</strong> {event.organizador_id}</p>
      <p><strong>Status:</strong> {event.status}</p>

      <h2>Ingressos</h2>
      {tickets.length > 0 ? (
        <table border={1}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Quantidade Disponível</th>
              <th>Data de Início</th>
              <th>Horário de Início</th>
              <th>Data Final</th>
              <th>Horário Final</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.tipo}</td>
                <td>R$ {Number(ticket.preco).toFixed(2)}</td>
                <td>{ticket.quantidade_disponivel}</td>
                <td>{ticket.data_inicio ? new Date(ticket.data_inicio).toLocaleDateString("pt-BR") : "Data inválida"}</td>
                <td>{ticket.data_inicio ? new Date(ticket.data_inicio).toLocaleTimeString("pt-BR") : "Horário inválido"}</td>
                <td>{ticket.data_final ? new Date(ticket.data_final).toLocaleDateString("pt-BR") : "Data inválida"}</td>
                <td>{ticket.data_final ? new Date(ticket.data_final).toLocaleTimeString("pt-BR") : "Horário inválido"}</td>
                <td>
                  <button onClick={() => window.location.href = `/ticket/edit?id=${ticket.id}`}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum ingresso cadastrado para este evento.</p>
      )}

      <h2>Ações</h2>
      {userType === "participante" ? (
        <button onClick={() => window.location.href = "/ticket/register"}>Reservar</button>
      ) : userType === "admin" || userType === "produtor" ? (
        <button onClick={() => window.location.href = `/event/edit?id=${id}`}>Editar</button>
      ) : null}
    </div>
  );
}