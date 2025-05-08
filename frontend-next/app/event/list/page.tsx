"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import { apiFetch } from "@/app/utils/api";

const Agenda = () => {
  const [events, setEvents] = useState<{ nome: string; data_inicio: string; descricao: string; city: string; local: string; capa?: string }[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [location, setLocation] = useState("Brasil");
  const [totalEvents, setTotalEvents] = useState(0);
  const [filters, setFilters] = useState({ city: "", date: "" });

  const fetchFilteredEvents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        city: filters.city,
        date: filters.date,
        order: "asc",
      });
      const data = await apiFetch(`/api/admin/events?${queryParams.toString()}`);
      setEvents(data);
    } catch (error) {
      console.error("Erro ao buscar eventos filtrados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredEvents();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await apiFetch(`/api/admin/events/upcoming?page=${page}`);
        const data = Array.isArray(response) ? response : [];
        setEvents((prevEvents) => Array.isArray(prevEvents) ? [...prevEvents, ...data] : [...data]);
        if (data.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  useEffect(() => {
    const fetchTotalEvents = async () => {
      try {
        const data = await apiFetch("/api/admin/events/total");
        setTotalEvents(data.total);
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    fetchTotalEvents();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const data = await apiFetch(
                `/api/admin/reverse-geocode?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
              );
              setLocation(data.principalSubdivision || "no Brasil");
            } catch (error) {
              console.error("Error fetching location:", error);
            }
          },
          () => {
            setLocation("no Brasil");
            setFilters((prevFilters) => ({ ...prevFilters, city: "" }));
          }
        );
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchAndDisplayEvents = async () => {
      try {
        const response = await apiFetch("/api/admin/events"); // Busca os eventos do backend
        const eventsData = response.events || []; // Garante que os dados sejam um array
        setEvents(eventsData); // Atualiza o estado com os eventos retornados
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchAndDisplayEvents();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1);
    };
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />
      <main className="p-4 text-[#F9F9F9] font-montserrat">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-3xl font-bold text-center mb-2">EVENTOS EM {location.toUpperCase()}</h1>
          <div className="flex justify-between items-center w-full max-w-[1230px]">
            <p className="text-sm text-left">{totalEvents}</p>
            <button className="px-4 py-2 bg-[#282828] text-[#F9F9F9] text-sm rounded shadow-md" style={{ boxShadow: '4px 4px 8px #000000' }}>Publicar Evento</button>
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <select
            name="city"
            onChange={handleFilterChange}
            className="px-4 py-2 bg-[#282828] bg-opacity-60 text-[#F9F9F9] text-sm rounded shadow-md"
            style={{ boxShadow: '4px 4px 8px #000000' }}
          >
            <option value="">Filtrar por Cidade</option>
            {Array.from(new Set((Array.isArray(events) ? events.filter(event => event.city).map(event => event.city) : []).filter(city => city))).map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            onChange={handleFilterChange}
            className="px-4 py-2 bg-[#282828] bg-opacity-60 text-[#F9F9F9] text-sm rounded shadow-md"
            style={{ boxShadow: '4px 4px 8px #000000' }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {Array.isArray(events) ? events.map((event, index) => (
            <div
              key={index}
              className="p-4 border rounded shadow-md bg-white hover:shadow-lg transition-shadow duration-300 flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                {event.capa && event.capa.trim() !== "" && (
                  <img
                    src={event.capa}
                    alt={`Capa do evento ${event.nome}`}
                    className="w-16 h-16 object-cover rounded"
                    loading="lazy"
                  />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#171717]">{event.nome}</h2>
                <p className="text-gray-600">{new Date(event.data_inicio).toLocaleString()}</p>
              </div>
            </div>
          )) : <p>Nenhum evento encontrado.</p>}
        </div>
        {loading && <p>Carregando...</p>}
        {!hasMore && <p>Não há mais eventos para carregar.</p>}
      </main>
      <style jsx>{`
        div {
          border: 1px solid red;
        }
      `}</style>
    </>
  );
};

export default Agenda;