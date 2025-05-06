"use client";

import "../../globals.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "@/app/components/FormContainer";
import InputField from "@/app/components/InputField";
import BackButton from "@/app/components/BackButton";
import GreetingText from "@/app/components/GreetingText";
import LoginButton from "@/app/components/LoginButton";
import SocialButton from "@/app/components/SocialButton";
import { FacebookLogo, GoogleLogo } from "@phosphor-icons/react";

export default function RegisterStep1() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [confirmacaoEmail, setConfirmacaoEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      nome,
      sobrenome,
      email,
      confirmacao_email: confirmacaoEmail,
      password,
      confirmacao_senha: confirmacaoSenha,
      telefone,
    };
    localStorage.setItem("registerStep1", JSON.stringify(formData));
    router.push("/auth/register/step2");
  };

  return (
    <div className="flex flex-col items-center place-content-center h-screen p-[20px]">
    <FormContainer>
      <BackButton />
      <GreetingText text="Bem vindo à Entrance" />
      <form onSubmit={handleNext}>
        <div className="flex gap-5 mb-5">
          <InputField
            type="text"
            id="nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            required
          />
          <InputField
            type="text"
            id="sobrenome"
            name="sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            placeholder="Sobrenome"
            required
          />
        </div>
        <div className="mb-5">
          <InputField
            type="text"
            id="telefone"
            name="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            required
          />
        </div>
        <div className="mb-5">
          <InputField
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
          />
        </div>
        <div className="mb-5">
          <InputField
            type="email"
            id="confirmacao_email"
            name="confirmacao_email"
            value={confirmacaoEmail}
            onChange={(e) => setConfirmacaoEmail(e.target.value)}
            placeholder="Confirme seu email"
            required
          />
        </div>
        <div className="mb-5">
          <InputField
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
        </div>
        <div className="mb-5">
          <InputField
            type="password"
            id="confirmacao_senha"
            name="confirmacao_senha"
            value={confirmacaoSenha}
            onChange={(e) => setConfirmacaoSenha(e.target.value)}
            placeholder="Confirme sua senha"
            required
          />
        </div>
               <LoginButton>Avançar</LoginButton>
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
      </form>
    </FormContainer>
    </div>
  );
}
