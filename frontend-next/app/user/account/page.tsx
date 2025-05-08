"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { User } from "phosphor-react";
import { apiFetch } from "@/app/utils/api";

interface UserData {
  nome: string;
  email: string;
  telefone: string;
  tipo_usuario: string;
  ultimosEventos?: { nome: string; data: string }[];
}

export default function MyAccount() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login"); // Redirect to login if no token is found
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const data = await apiFetch("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/auth/login");
      }
    };

    fetchUserData();
  }, [router]);

  if (!userData) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Header />

      <main className="flex flex-col items-center mt-5">
        <div className="flex flex-col items-start w-[720px]">
          <h1 className="font-black text-2xl mb-5 w-full text-left text-[#f9f9f9] font-montserrat">
            Meus dados
          </h1>
          <div className="relative flex user-details mb-10 w-full bg-[transparent] p-[20px] rounded-lg shadow-custom-double text-[#F9F9F9]">
            <div className="profile-container flex items-center space-x-5 w-full h-full">
              <div className="profile-icon relative flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#F9F9F9]">
                <User size={50} color="#171717" />
              </div>
              <div>
                <h2 className="font-black text-2xl text-[#f9f9f9] font-montserrat uppercase">
                  {userData.nome}
                </h2>
                <div className="font-bold text-xs opacity-50 font-poppins">
                  <p>{userData.email}</p>
                  <p>
                    {userData.telefone.replace(
                      /(\d{2})(\d{1})(\d{4})(\d{4})/,
                      "($1) $2 $3-$4"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="font-bold font-poppins text-xs place-content-center flex items-center">
              <a href="">Editar</a>
            </div>
          </div>

          <h1 className="font-black text-2xl w-full text-left mb-5 text-[#f9f9f9] font-montserrat">
            Últimos eventos
          </h1>
          <div className="relative flex user-details mb-10 w-full bg-[transparent] p-[20px] rounded-lg shadow-custom-double text-[#F9F9F9] font-bold text-xs font-poppins">
            <div className="opacity-50">
              {userData.ultimosEventos && userData.ultimosEventos.length > 0 ? (
                <ul className="list-disc pl-5 mb-5">
                  {userData.ultimosEventos.map((evento, index) => (
                    <li key={index} className="mb-1">
                      {evento.nome} - {evento.data}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum evento encontrado.</p>
              )}
            </div>
          </div>
          <button
            className="h-full p-3 text-xs font-black font-montserrat uppercase bg-[rgba(40,40,40,0.5)] text-[#f9f9f9] rounded-md relative overflow-hidden transition-all duration-500 ease-in-out"
          >
            <span className="absolute place-content-center inset-0 bg-gradient-to-r from-[#21CF63] to-[#8A35CE] opacity-0 hover:shadow-custom-double hover:opacity-100 transition-opacity duration-500 ease-in-out">Descobrir novos eventos</span>
            
            Descobrir novos eventos
          </button>
        </div>
      </main>
    </>
  );
}
