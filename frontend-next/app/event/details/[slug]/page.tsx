"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Header from "@/app/components/Header";
import { PencilSimple, Plus, Minus, CaretDown } from "phosphor-react";
import Blob from "@/app/components/Blob";

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
  const [showConsumo, setShowConsumo] = useState(false);
  const [showProdutos, setShowProdutos] = useState(false);

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
      <div
        className="fixed inset-0 flex justify-center items-center z-[-1]"
      >
        <Blob />
      </div>
      <Header />
      <div className="flex w-full max-w-[1230px] gap-5 mt-5">
        <div className=" w-1/2 flex flex-col gap-10">
          <div className="flex w-full h-[670px]  place-content-between">
            <div className="w-[460px] h-full bg-white rounded-l-[40px] rounded-r-sm shadow-custom-double"></div>
            <div className="flex flex-col gap-5">
              <p className="text-2xl font-black font-montserrat uppercase leading-none text-[#f9f9f9]">
                Line-up
              </p>
              <div
                className="w-[120px] h-full flex flex-col gap-5 overflow-hidden"
                ref={scrollContainerRef}
                onWheel={handleScroll}
              >
                <div className="bg-[rgba(40,40,40,0.5)] backdrop-blur-sm w-[120px] h-[120px] flex-shrink-0 rounded-xs shadow-custom-double"></div>
                <div className="bg-[rgba(40,40,40,0.5)] backdrop-blur-sm w-[120px] h-[120px] flex-shrink-0 rounded-xs shadow-custom-double"></div>
                <div className="bg-[rgba(40,40,40,0.5)] backdrop-blur-sm w-[120px] h-[120px] flex-shrink-0 rounded-xs shadow-custom-double"></div>
                <div className="bg-[rgba(40,40,40,0.5)] backdrop-blur-sm w-[120px] h-[120px] flex-shrink-0 rounded-xs shadow-custom-double"></div>
                <div className="bg-[rgba(40,40,40,0.5)] backdrop-blur-sm w-[120px] h-[120px] flex-shrink-0 rounded-xs shadow-custom-double"></div>
                <div className="bg-[rgba(40,40,40,0.5)] backdrop-blur-sm w-[120px] h-[120px] flex-shrink-0 rounded-xs shadow-custom-double"></div>
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
          <div className="flex flex-col w-[600px] h-[300px] bg-black gap-5"></div>
        </div>
        <div className=" w-1/2 flex flex-col gap-5 text-[#f9f9f9]">
          <div className="flex place-content-between w-full">
            <div className="h-auto">
              <p className="text-4xl font-black font-montserrat uppercase leading-none">
                Nome do evento
              </p>
              <div className="mt-5">
                <p className="text-sm font-poppins font-bold">
                  20/05/2025 - 18:00, São Paulo - SP
                </p>
                <p className="text-sm font-poppins font-bold">
                  Rua jose filho de almeida, 208
                </p>
                <p className="text-sm font-poppins font-bold">
                  Sitio Joaquim Barbosa.{" "}
                </p>
              </div>
            </div>
            <div>
              <button className="bg-[rgba(40,40,40,0.5)] font-black font-montserrat px-4 py-2 text-xs uppercase rounded-sm flex gap-5 items-center">
                Editar eventos
                <PencilSimple size={16} weight="bold" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-2xl font-black font-montserrat uppercase leading-none">
              Vertentes
            </p>
            <p className="text-sm font-poppins font-bold">
              PSYTRANCE - FULL ON - FULL ON NIGHT - PROGRESSIVE
            </p>
          </div>
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-5">
              <p className="text-2xl font-black font-montserrat uppercase leading-none">
                Ingressos
              </p>
              <div className="flex place-content-between rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5">
                <p className="flex text-xs font-bold font-poppins leading-none items-center">
                  nº Lote - R$ 50
                </p>
                <div className="flex gap-5 items-center">
                  <Plus size={16} weight="bold" />
                  <p className="flex text-xs font-bold font-poppins leading-none items-center">
                    0
                  </p>
                  <Minus size={16} weight="bold" />
                </div>
              </div>
              <div className="flex place-content-between rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5">
                <p className="flex text-xs font-bold font-poppins leading-none items-center">
                  nº Lote - R$ 50
                </p>
                <div className="flex gap-5 items-center">
                  <Plus size={16} weight="bold" />
                  <p className="flex text-xs leading-none items-center">0</p>
                  <Minus size={16} weight="bold" />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-10">
              <div className="flex n items-center gap-5">
                <p className="text-2xl font-black font-montserrat uppercase leading-none">
                  Estacionamento
                </p>
                <div
                  className="flex gap-5 cursor-pointer"
                  onClick={() => {
                    setShowConsumo((prev) => !prev);
                  }}
                >
                  <CaretDown size={28} weight="bold" />
                </div>
              </div>
              {showConsumo && (
                <>
                  <div className="flex rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5 text-xs font-bold font-poppins leading-none items-center cursor-pointer select-none focus:outline-none">
                    <p className="flex text-xs font-bold font-poppins leading-none items-center">
                      Moto - R$ 40
                    </p>
                  </div>
                  <div className="flex place-content-between rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5 text-xs font-bold font-poppins leading-none items-center cursor-pointer select-none focus:outline-none">
                    <p className="flex text-xs font-bold font-poppins leading-none items-center">
                      Carro - R$ 80
                    </p>
                  </div>
                </>
              )}
              <div className="flex items-center gap-5">
                <p className="text-2xl font-black font-montserrat uppercase leading-none">
                  Consumação
                </p>
                <div
                  className="flex gap-5 cursor-pointer"
                  onClick={() => {
                    setShowConsumo((prev) => !prev);
                  }}
                >
                  <CaretDown size={28} weight="bold" />
                </div>
              </div>
              {showConsumo && (
                <>
                  <div className="flex rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5 text-xs font-bold font-poppins leading-none items-center cursor-pointer select-none focus:outline-none">
                    <p className="flex text-xs font-bold font-poppins leading-none items-center">
                      R$ 50
                    </p>
                  </div>
                  <div className="flex place-content-between rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5 text-xs font-bold font-poppins leading-none items-center cursor-pointer select-none focus:outline-none">
                    <p className="flex text-xs font-bold font-poppins leading-none items-center">
                      R$ 100
                    </p>
                  </div>
                </>
              )}
              <div className="flex n items-center gap-5">
                <p className="text-2xl font-black font-montserrat uppercase leading-none">
                  Produtos
                </p>
                <div
                  className="flex gap-5 cursor-pointer"
                  onClick={() => {
                    setShowProdutos((prev) => !prev);
                  }}
                >
                  <CaretDown size={28} weight="bold" />
                </div>
              </div>
              {showProdutos && (
                <>
                  <div className="flex place-content-between rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5 text-xs font-bold font-poppins leading-none items-center cursor-pointer select-none focus:outline-none">
                    <p className="flex text-xs font-bold font-poppins leading-none items-center">
                      Cordão - R$ 20
                    </p>
                    <div className="flex gap-5 items-center">
                      <Plus size={16} weight="bold" />
                      <p className="flex text-xs font-bold font-poppins leading-none items-center">
                        0
                      </p>
                      <Minus size={16} weight="bold" />
                    </div>
                  </div>
                  <div className="flex place-content-between rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5 text-xs font-bold font-poppins leading-none items-center cursor-pointer select-none focus:outline-none">
                    <p className="flex text-xs font-bold font-poppins leading-none items-center">
                      Copo - R$ 20
                    </p>
                    <div className="flex gap-5 items-center">
                      <Plus size={16} weight="bold" />
                      <p className="flex text-xs font-bold font-poppins leading-none items-center">
                        0
                      </p>
                      <Minus size={16} weight="bold" />
                    </div>
                  </div>
                  <div className="flex place-content-between rounded-sm bg-[rgba(82,82,82,0.5)] w-full h-[60px] p-5 text-xs font-bold font-poppins leading-none items-center cursor-pointer select-none focus:outline-none">
                    <p className="flex text-xs font-bold font-poppins leading-none items-center">
                      Camiseta - R$ 120
                    </p>
                    <div className="flex gap-5 items-center">
                      <Plus size={16} weight="bold" />
                      <p className="flex text-xs font-bold font-poppins leading-none items-center">
                        0
                      </p>
                      <Minus size={16} weight="bold" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col items-end gap-5 text-right">
              <p className="text-2xl font-black font-montserrat uppercase leading-none">
                Itens selecionados:
              </p>
              <div className="text-xs font-bold font-poppins">
                <p>nº Lote - R$ 50 x 2: R$ 100</p>
                <p>Camiseta - R$ 120 x 3: R$ 360</p>
                <p>Cordão - R$ 20 x 1: R$ 20</p>
                <p>Copo - R$ 20 x 2: R$ 40</p>
              </div>
              <p className="text-2xl font-black font-montserrat uppercase leading-none">
                Total: R$ 150
              </p>
              <button className="bg-[#21CF63] font-black font-montserrat px-4 py-2 text-xs uppercase rounded-sm gap-5 items-center">
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
