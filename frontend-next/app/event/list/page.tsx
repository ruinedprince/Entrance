"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import { apiFetch } from "@/app/utils/api";

const Agenda = () => {
  const [events, setEvents] = useState<{ id: number; descricao: string; local: string; organizador_id: number; nome: string; data_inicio: string; data_final: string; status: string; capa?: string; cidade: string; estado: string }[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiFetch("/api/events"); // Fetch events from the backend
        const eventsData = response.events.map((event: any) => ({
          ...event,
          capa: event.capa ? `http://localhost:5000${event.capa}` : undefined,
        })); // Handle the response format
        setEvents(eventsData); // Update the state with the fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Header />
      <main className="p-4 text-[#F9F9F9] font-montserrat">
        <h1 className="text-3xl font-bold text-center mb-4">Eventos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, index) => (
            <div key={index} className="p-4 border rounded shadow-md bg-white">
              {event.capa ? (
                <img
                  src={event.capa}
                  alt={`Capa do evento ${event.nome}`}
                  className="w-full h-48 object-cover rounded mb-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const errorText = document.createElement('p');
                    errorText.textContent = 'Erro ao buscar imagem';
                    errorText.style.color = 'red';
                    e.currentTarget.parentElement?.appendChild(errorText);
                  }}
                />
              ) : (
                <p>Erro ao buscar imagem</p>
              )}
              <h2 className="text-xl font-semibold mb-2">{event.nome}</h2>
              <p className="text-gray-600">{new Date(event.data_inicio).toLocaleDateString()}</p>
              <p className="text-gray-600">{event.cidade}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Agenda;