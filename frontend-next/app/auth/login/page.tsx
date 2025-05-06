"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import { ArrowLeft } from "@phosphor-icons/react";
import { FacebookLogo, GoogleLogo } from "@phosphor-icons/react";
import InputField from "../../components/InputField";
import LoginButton from "../../components/LoginButton";
import SocialButton from "../../components/SocialButton";

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
      console.log("Dados recebidos no login:", data); // Log para depuração

      if (data.token) {
        localStorage.setItem("token", data.token); // Salvar o token no localStorage
      } else {
        setError("Token não recebido. Verifique a API.");
        return;
      }

      if (data.role === "participante") {
        router.push("/user/account");
      } else if (data.role === "administrador") {
        router.push("/admin/dashboard");
      } else {
        setError("Papel do usuário desconhecido. Verifique a API.");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    }
  };

  return (
    <div className="flex flex-col items-center place-content-between h-screen p-[20px]">
      <img
        src="/images/logo-branca.png.webp"
        alt="Logo"
        className="w-36 object-contain"
      />
      <div className="relative w-full max-w-md bg-[#d9d9d9] p-8 rounded-lg shadow-md text-center rounded-l-[40px] rounded-r-sm min-w-[580px] mx-auto items-center justify-center gap-5">
        <button className="inset-y-2 inset-x-2 flex items-center gap-1 text-[12px] font-bold font-poppins hover:opacity-50 transition-opacity duration-500 ease-in-out">
          <ArrowLeft size={12} weight="bold" />
          <span>Voltar</span>
        </button>
        <h1 className="font-black text-2xl mb-5 text-[#171717]">
          BEM VINDO(A) DE VOLTA!
        </h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <InputField
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <InputField
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <a
            href="#"
            className="text-xs text-[#171717] self-end mb-2 font-bold font-poppins underline hover:opacity-50 transition-opacity duration-500 ease-in-out"
          >
            Esqueceu a senha?
          </a>
          <LoginButton>LOGIN</LoginButton>
        </form>
        <p className="text-sm mt-5 font-bold font-poppins text-[12px]">
          Ainda não tem uma conta?{" "}
          <a
            href="/register"
            className="text-[#171717] underline hover:opacity-50 transition-opacity duration-500 ease-in-out"
          >
            Cadastre-se!
          </a>
        </p>
        <div
          className="h-px my-5 border-t"
          style={{
            borderImage: "linear-gradient(to right, #21CF63, #8A35CE) 1",
          }}
        ></div>
        <div className="flex flex-col gap-4">
          <SocialButton>
            <FacebookLogo size={12} color="#171717" weight="bold" />
            CONTINUAR COM FACEBOOK
          </SocialButton>
          <SocialButton>
            <GoogleLogo size={12} color="#171717" weight="fill" />
            CONTINUAR COM GOOGLE
          </SocialButton>
          <p className="text-sm mt-5 font-bold font-poppins text-center text-[12px]">
            Ao continuar, você aceita os{" "}
            <a
              href="#"
              className="text-[#171717] underline hover:opacity-50 transition-opacity duration-500 ease-in-out"
            >
              Termos de Uso{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #21CF63, #8A35CE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Entrance
              </span>
            </a>{" "}
            e a{" "}
            <a
              href="#"
              className="text-[#171717] underline hover:opacity-50 transition-opacity duration-500 ease-in-out"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
      <p className="text-sm text-[#f9f9f9] opacity-50 font-bold font-poppins text-[12px] transition-opacity duration-500 ease-in-out">
        Esse site é protegido por reCAPTCHA e a{" "}
        <a
          href=""
          className="text-[#f9f9f9] underline hover:opacity-100 transition-opacity duration-500 ease-in-out"
        >
          Política de Privacidade
        </a>{" "}
        e{" "}
        <a
          href=""
          className="text-[#f9f9f9] underline hover:opacity-100 transition-opacity duration-500 ease-in-out"
        >
          Termos de Serviço
        </a>
        {" "}do Google se aplicam.
      </p>
    </div>
  );
}