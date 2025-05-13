"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";

const Home = () => {
  const [events, setEvents] = useState<{ capa: string; nome: string; data_inicio: string; city: string; local: string; slug: string }[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/list?order=asc&limit=10");
        const data = await response.json();
        console.log("Fetched events:", data.events); // Debugging log
        console.log("Eventos recebidos:", data.events);
        const eventosSemSlug = data.events.filter((event: any) => !event.slug);
        if (eventosSemSlug.length > 0) {
          console.warn("Eventos sem slug:", eventosSemSlug);
        }
        setEvents(data.events);
        setLocation(data.location);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="w-full max-w-[1230px]">
          <div className="flex flex-col items-center mt-10 px-4 sm:px-6 lg:px-8">
            {/* Rotating Banner */}
            <div className="w-full h-[200px] sm:h-[300px] bg-gray-300 rounded-lg overflow-hidden mb-4">
              {/* Placeholder for rotating banner content */}
              <div className="h-full flex items-center justify-center text-lg sm:text-xl font-bold text-gray-700">
                Rotating Banner Placeholder
              </div>
            </div>

            {/* Carousel for next 10 events */}
            <div className="w-full flex-col place-content-center">
              <div
                className="h-px gap-5 border-t max-w-[1230px] mx-auto my-10"
                style={{
                  borderImage: "linear-gradient(to right, #21CF63, #8A35CE) 1"
                }}
              ></div>
              <h1 className="text-xl sm:text-2xl font-black font-montserrat mb-5 text-[#F9F9F9] uppercase text-lifted">
                Próximos eventos {location}
              </h1>
              <div className="flex flex-col items-center h-auto overflow-y-auto py-5">
                <div className="flex flex-row overflow-x-auto scrollbar-bold scrollbar-thumb-gray-500 scrollbar-track-gray-300 gap-5 px-4 sm:px-0 snap-x snap-mandatory">
                  <div className="pl-8 sm:pl-12 snap-start flex-shrink-0"></div> {/* Espaçamento inicial ajustado */}
                  {Array.isArray(events) && events.length > 0 ? (
                    events.slice(0, 10).map((event, index) => (
                      <div
                        key={index}
                        className="group relative h-[200px] sm:h-[320px] w-[150px] sm:w-[220px] overflow-hidden rounded-l-[20px] sm:rounded-l-[40px] rounded-r-sm shadow-lg cursor-pointer"
                        style={{
                          backgroundImage: `url(http://localhost:5000${event.capa})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        onClick={() => {
                          if (event.slug) {
                            window.location.href = `/event/details/${event.slug}`;
                          } else {
                            console.error("Slug não definido para o evento:", event);
                          }
                        }}
                      >
                        <div className="flex flex-col place-content-center absolute bottom-0 w-full translate-y-full backdrop-blur-sm bg-[rgba(40,40,40,0.5)] p-2 sm:p-4 text-white transition-transform duration-500 group-hover:translate-y-0">
                          <h3 className="text-sm sm:text-lg font-black font-montserrat uppercase">
                            {event.nome}
                          </h3>
                          <p className="text-xs sm:text-sm font-bold font-poppins">
                            {new Date(event.data_inicio).toLocaleDateString()} - {new Date(event.data_inicio).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs sm:text-sm font-bold font-poppins">
                            {event.city}, {event.local}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <button className="px-4 py-2 bg-[#282828] text-[#F9F9F9] text-sm rounded uppercase">
                        Mais eventos em {location}
                      </button>
                    </div>
                  )}
                  <div className="pr-4 sm:pr-6 snap-end flex-shrink-0"></div> {/* Espaçamento final */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
