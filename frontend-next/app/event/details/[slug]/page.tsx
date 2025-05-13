"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Header from "@/app/components/Header";

type EventData = {
  nome: string;
  descricao: string;
  data_inicio: string;
  horario_inicio: string;
  capa: string;
  cidade: string;
  estado: string;
  local: string;
};

export default function DetailsPage() {
  const pathname = usePathname();
  const slug = pathname ? pathname.split("/").pop() : null;
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += event.deltaY;
    }
  };

  useEffect(() => {
    if (slug) {
      axios
        .get(`/api/events/slug/${slug}`)
        .then((response) => setEventData(response.data))
        .catch(() => setError("Failed to load event data"));
    }
  }, [slug]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!eventData) {
    return <div>Loading...</div>;
  }

  const imagePath = eventData.capa.replace("uploads/eventos/capa/", "");

  return (
    <>
      <Header />
      <div className="flex w-full max-w-[1230px] gap-5 mt-5">
        <div className=" w-full flex flex-col gap-10">
          <div className="flex w-full h-[670px]  place-content-between">
            <div className="w-[460px] h-full bg-white rounded-l-[40px] rounded-r-sm"></div>
            <div className="flex flex-col gap-5">
              <p className="text-2xl font-black font-montserrat uppercase leading-none text-[#f9f9f9]">
                Line-up
              </p>
              <div
                className="w-[120px] h-full flex flex-col gap-5 overflow-hidden"
                ref={scrollContainerRef}
                onWheel={handleScroll}
              >
                <div className="bg-black w-[120px] h-[120px] flex-shrink-0 rounded-xs"></div>
                <div className="bg-red-500 w-[120px] h-[120px] flex-shrink-0 rounded-xs"></div>
                <div className="bg-blue-500 w-[120px] h-[120px] flex-shrink-0 rounded-xs"></div>
                <div className="bg-green-500 w-[120px] h-[120px] flex-shrink-0 rounded-xs"></div>
                <div className="bg-purple-500 w-[120px] h-[120px] flex-shrink-0 rounded-xs"></div>
                <div className="bg-blue-500 w-[120px] h-[120px] flex-shrink-0 rounded-xs"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full  gap-5">
            <p className="text-2xl font-black font-montserrat uppercase leading-none text-[#f9f9f9]">
              Descrição
            </p>
            <p className="text-sm font-poppins font-bold text-[#f9f9f9]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              tincidunt at turpis nec fringilla. Proin vitae massa feugiat,
              consectetur dui vitae, eleifend ante. Ut quam quam, laoreet nec
              tristique cursus, faucibus nec nisi. Aenean quis diam leo. Sed
              fermentum, libero at eleifend consectetur, dui velit ullamcorper
              risus, gravida tristique nisl lectus eu sapien. Phasellus
              condimentum sapien et sem varius dapibus eu a tortor. Donec ut sem
              ut mauris porttitor dapibus. Quisque dictum, sapien sed sagittis
              faucibus, est neque commodo tortor, vitae interdum mi mi eu
              libero. Praesent sed dictum leo. Fusce pulvinar neque facilisis
              justo viverra, vel sodales orci aliquam. Aenean vehicula tellus
              diam, vitae vehicula lorem accumsan nec. Morbi tempor lectus
              efficitur nunc varius blandit. Donec auctor euismod lorem at
              rhoncus. Suspendisse scelerisque iaculis nunc, ut facilisis mi
              varius id. Sed sit amet tellus feugiat, euismod magna gravida,
              mattis diam. Curabitur vel ex id lacus commodo interdum vitae id
              tortor.
            </p>
          </div>
          <div className="flex flex-col w-full  gap-5">
            <p className="text-2xl font-black font-montserrat uppercase leading-none text-[#f9f9f9]">
              Produtores
            </p>
            <p className="text-sm font-poppins font-bold text-[#f9f9f9]">
              Produtor X e Produtor Y
            </p>
          </div>
          <div className="flex flex-col w-[600px] h-[300px] bg-black  gap-5"></div>
        </div>
        <div className=" w-full border border-red-500">
          direita
          <p>Nome do evento</p>
          <div>
            <p>20/05/2025 - 18:00 , São Paulo - SP</p>
            <p>Rua jose filho de almeida, 208</p>
            <p>Sitio Joaquim Barbosa. </p>
          </div>
        </div>
      </div>
    </>
  );
}
