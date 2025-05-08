"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import { FacebookLogo, GoogleLogo } from "@phosphor-icons/react";
import InputField from "../../components/InputField";
import PatternButton from "../../components/PatternButton";
import SocialButton from "../../components/SocialButton";
import FormContainer from "@/app/components/FormContainer";
import BackButton from "@/app/components/BackButton";
import GreetingText from "../../components/GreetingText";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

      console.log("Papel do usuário recebido:", data.role); // Log para depuração

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
    <div
      className="flex flex-col items-center place-content-between h-screen p-[20px] gap-5"
      style={{ overflowX: "hidden" }}
    >
      <img
        src="/images/logo-branca.png.webp"
        alt="Logo"
        className="w-36 object-contain"
      />
      <FormContainer>
        <BackButton />
        <GreetingText text="BEM VINDO(A) DE VOLTA!" />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          <PatternButton>LOGIN</PatternButton>
        </form>
        <p className="text-sm mt-5 font-bold font-poppins text-[12px] text-center">
          Ainda não tem uma conta? <br className="sm:hidden" />
          <a
            href="/auth/register"
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
        <div className="flex flex-col gap-5">
          <SocialButton>
            <FacebookLogo size={isMobile ? 25 : 12} color="#171717" weight="bold" />
            CONTINUAR COM FACEBOOK
          </SocialButton>
          <SocialButton>
            <GoogleLogo size={isMobile ? 25 : 12} color="#171717" weight="fill" />
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
      </FormContainer>
      <div></div>
    </div>
  );
}