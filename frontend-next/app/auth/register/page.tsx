"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function RegisterStep1() {
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      nome: (document.getElementById("nome") as HTMLInputElement).value,
      sobrenome: (document.getElementById("sobrenome") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      confirmacao_email: (document.getElementById("confirmacao_email") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value,
      confirmacao_senha: (document.getElementById("confirmacao_senha") as HTMLInputElement).value,
      telefone: (document.getElementById("telefone") as HTMLInputElement).value,
    };
    localStorage.setItem("registerStep1", JSON.stringify(formData));
    router.push("/auth/register/step2");
  };

  return (
    <div>
      <h1>Cadastro - Etapa 1</h1>
      <form onSubmit={handleNext}>
        <label htmlFor="nome">Nome:</label>
        <input type="text" id="nome" name="nome" required />
        <br />
        <label htmlFor="sobrenome">Sobrenome:</label>
        <input type="text" id="sobrenome" name="sobrenome" required />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <br />
        <label htmlFor="confirmacao_email">Confirmação de Email:</label>
        <input type="email" id="confirmacao_email" name="confirmacao_email" required />
        <br />
        <label htmlFor="password">Senha:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <label htmlFor="confirmacao_senha">Confirmação de Senha:</label>
        <input type="password" id="confirmacao_senha" name="confirmacao_senha" required />
        <br />
        <label htmlFor="telefone">Telefone:</label>
        <input type="text" id="telefone" name="telefone" required />
        <br />
        <button type="submit">Avançar</button>
      </form>
    </div>
  );
}