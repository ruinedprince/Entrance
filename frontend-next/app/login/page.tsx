"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.headers.get("content-type")?.includes("application/json")) {
          const errorData = await response.json();
          setError(errorData.message || "Erro ao fazer login");
        } else {
          setError("Resposta inesperada do servidor");
        }
        return;
      }

      const data = await response.json();
      alert("Login bem-sucedido!");

      if (data.role) {
        if (data.role === "administrador") {
          router.push("/admin_dashboard");
        } else if (data.role === "participante") {
          router.push("/participant_dashboard");
        }
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="w-36 h-36 bg-white border-2 border-gray-300 mb-5"></div>
      <div className="w-full max-w-md bg-white p-5 rounded-lg shadow-md text-center">
        <h1 className="font-black text-2xl mb-5 text-gray-800">BEM VINDO(A) DE VOLTA!</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="font-bold text-sm text-gray-600 text-left">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-sm border border-gray-300 rounded"
            required
          />
          <label htmlFor="password" className="font-bold text-sm text-gray-600 text-left">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-sm border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="p-2 text-lg font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            LOGIN
          </button>
        </form>
        <a href="#" className="text-xs text-blue-500 mt-2">
          Esqueceu a senha?
        </a>
        <p className="text-sm mt-5">
          Ainda não tem uma conta? <a href="/register" className="text-blue-500">Cadastre-se!</a>
        </p>
        <div className="h-px bg-gray-300 my-5"></div>
        <button className="p-2 text-sm font-bold text-white bg-gray-800 rounded mb-2 hover:bg-gray-600">
          CONTINUAR COM FACEBOOK
        </button>
        <button className="p-2 text-sm font-bold text-white bg-gray-800 rounded hover:bg-gray-600">
          CONTINUAR COM GOOGLE
        </button>
        <p className="text-xs text-gray-600 mt-5">
          Ao continuar, você aceita os <a href="#" className="text-blue-500">Termos de Uso</a> e a <a href="#" className="text-blue-500">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}