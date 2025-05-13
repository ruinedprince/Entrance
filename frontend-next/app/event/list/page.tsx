"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import { apiFetch } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "phosphor-react";
import BlobComponent from "../../components/Blob";

const Agenda = () => {
  const router = useRouter();
  const [events, setEvents] = useState<
    {
      nome: string;
      data_inicio: string;
      descricao: string;
      city: string;
      local: string;
      capa?: string;
      slug?: string;
    }[]
  >([]);
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
      const data = await apiFetch(`/api/events?${queryParams.toString()}`);
      const eventsData = Array.isArray(data) ? data : data.events || [];
      const updatedEvents = eventsData.map(
        (event: {
          capa?: string;
          nome: string;
          data_inicio: string;
          descricao: string;
          city: string;
          local: string;
          slug?: string;
        }) => ({
          ...event,
          capa: event.capa ? `http://localhost:5000${event.capa}` : undefined,
        })
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Erro ao buscar eventos filtrados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredEvents();
  }, [filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

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
        const response = await apiFetch("/api/events/list"); // Busca os eventos do backend
        const eventsData = response.events || response || []; // Lida com diferentes formatos de resposta
        const updatedEvents = eventsData.map(
          (event: {
            nome: string;
            data_inicio: string;
            descricao: string;
            city: string;
            local: string;
            capa?: string;
            slug?: string;
          }) => ({
            ...event,
            capa: event.capa ? `http://localhost:5000${event.capa}` : undefined,
          })
        );
        setEvents(updatedEvents); // Atualiza o estado com os eventos retornados
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchAndDisplayEvents();
  }, []);

  useEffect(() => {
    console.log("Eventos carregados:", events);
    const eventosSemSlug = events.filter((event) => !event.slug);
    if (eventosSemSlug.length > 0) {
      console.warn("Eventos sem slug:", eventosSemSlug);
    }
  }, [events]);

  useEffect(() => {
    console.log("Chamando API para eventos");
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEventClick = (event: { slug?: string }) => {
    if (!event || !event.slug) {
      alert("Este evento não possui um link válido no momento.");
      console.error("Slug não definido para o evento:", event);
      return;
    }
    console.log("Evento clicado:", event);
    router.push(`/event/details/${event.slug}`);
  };

  return (
    <>
      <div className="absolute flex place-content-center h-full w-full justify-center items-center">
        <BlobComponent />
      </div>
      <Header />
      <div className="flex text-[#F9F9F9] mt-5 mb-10 font-montserrat place-content-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl text-center font-black font-montserrat mb-5 uppercase">
            Eventos em {location}
          </h1>
          <div className="flex justify-between items-center w-full max-w-[1230px] font-bold font-poppins mb-10">
            <p className="text-sm text-left">{totalEvents} eventos</p>
            <button className="flex px-4 py-2 bg-[#282828] text-[#F9F9F9] text-sm rounded uppercase gap-5 items-center">
              Publicar Evento
              <ArrowUpRight size={16} color="#f9f9f9" weight="bold" />
            </button>
          </div>
          <div className="flex justify-center font-black font-montserrat">
            <select
              name="city"
              onChange={handleFilterChange}
              className="px-4 py-2 bg-[#282828] bg-opacity-60 text-[#F9F9F9] text-xs rounded mr-4 uppercase"
            >
              <option value="">Por cidade</option>
              {Array.from(
                new Set(
                  (Array.isArray(events)
                    ? events
                        .filter((event) => event.city)
                        .map((event) => event.city)
                    : []
                  ).filter((city) => city)
                )
              ).map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              onChange={handleFilterChange}
              className="px-4 py-2 bg-[#282828] bg-opacity-60 text-[#F9F9F9] text-xs rounded uppercase"
            />
          </div>
        </div>
      </div>
      <div
        className="h-px gap-5 border-t max-w-[1230px] mx-auto my-10"
        style={{
          borderImage: "linear-gradient(to right, #21CF63, #8A35CE) 1",
        }}
      ></div>
      <div className="flex place-content-center">
        <div className="w-full max-w-[1230px] flex-col place-content-center ">
          <h1 className="text-2xl font-black font-montserrat mb-10 text-[#F9F9F9] uppercase ">
            Próximos eventos em {location}
          </h1>
          <div className="relative flex flex-col items-center overflow-y-auto h-[440px] py-5 mb-5">
            <div className="absolute flex flex-row left-0 top-0 overflow-x-auto scrollbar-bold scrollbar-thumb-gray-500 scrollbar-track-gray-300 items-center">
              {Array.isArray(events) &&
                events.slice(0, 10).map((event, index) => (
                  <div
                    key={index}
                    className="group relative h-[440px] w-[300px] overflow-hidden rounded-l-[40px] rounded-r-sm shadow-lg mr-4 cursor-pointer"
                    style={{
                      backgroundImage: `url(${event.capa})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex flex-col place-content-center absolute bottom-0 w-full translate-y-full backdrop-blur-sm bg-[rgba(40,40,40,0.5)] p-4 text-white transition-transform duration-500 group-hover:translate-y-0">
                      <h3 className="text-lg font-black font-montserrat uppercase">
                        {event.nome}
                      </h3>
                      <p className="text-xs font-bold font-poppins">
                        {new Date(event.data_inicio).toLocaleDateString()} -{" "}
                        {new Date(event.data_inicio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs font-bold font-poppins">
                        {event.city}, {event.local}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex w-full place-content-center">
            <button className="p-3 text-xs font-black font-montserrat uppercase bg-[rgba(40,40,40,0.5)] text-[#f9f9f9] rounded-md relative overflow-hidden transition-all duration-500 ease-in-out">
              <span className="absolute place-content-center inset-0 bg-gradient-to-r from-[#21CF63] to-[#8A35CE] opacity-0 hover:shadow-custom-double hover:opacity-100 transition-opacity duration-500 ease-in-out">
                Descobrir novos eventos
              </span>
              Descobrir novos eventos
            </button>
          </div>
        </div>
      </div>
      <div
        className="h-px gap-5 border-t max-w-[1230px] mx-auto my-10"
        style={{
          borderImage: "linear-gradient(to right, #21CF63, #8A35CE) 1",
        }}
      ></div>
      {loading && <p>Carregando...</p>}
      {!hasMore && <p>Não há mais eventos para carregar.</p>}
    </>
  );
};

export default Agenda;
