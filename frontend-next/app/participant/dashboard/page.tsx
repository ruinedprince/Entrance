"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  nome: string;
  email: string;
  telefone: string;
}

export default function ParticipantDashboard() {
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
        const response = await fetch("http://localhost:5000/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: UserData = await response.json();
          setUserData(data);
        } else {
          router.push("/auth/login");
        }
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
    <div>
      <h1>Bem-vindo ao Painel do Participante</h1>
      <p>Nome: {userData.nome}</p>
      <p>Email: {userData.email}</p>
      <p>Telefone: {userData.telefone}</p>
    </div>
  );
}