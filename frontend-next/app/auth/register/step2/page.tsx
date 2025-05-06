"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterStep2() {
  const router = useRouter();
  const [step1Data, setStep1Data] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("registerStep1");
    if (data) {
      setStep1Data(JSON.parse(data));
    }
  }, []);

  const handleBack = () => {
    router.push("/auth/register");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const step2Data = {
      cpf: (document.getElementById("cpf") as HTMLInputElement).value,
      data_nascimento: (document.getElementById("data_nascimento") as HTMLInputElement).value,
      cep: (document.getElementById("cep") as HTMLInputElement).value,
      endereco: (document.getElementById("endereco") as HTMLInputElement).value,
      cidade: (document.getElementById("cidade") as HTMLInputElement).value,
      estado: (document.getElementById("estado") as HTMLInputElement).value,
      tipo_usuario: "participante",
    };

    const completeData = { ...(step1Data || {}), ...step2Data };

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        localStorage.removeItem("registerStep1");
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Tente novamente mais tarde.");
    }
  };

  return (
    <div>
      <h1>Cadastro - Etapa 2</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos da segunda etapa */}
        <label htmlFor="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" required />
        <br />
        <label htmlFor="data_nascimento">Data de Nascimento:</label>
        <input type="date" id="data_nascimento" name="data_nascimento" required />
        <br />
        <label htmlFor="cep">CEP:</label>
        <input type="text" id="cep" name="cep" required />
        <br />
        <label htmlFor="endereco">Endereço:</label>
        <input type="text" id="endereco" name="endereco" required />
        <br />
        <label htmlFor="cidade">Cidade:</label>
        <input type="text" id="cidade" name="cidade" required />
        <br />
        <label htmlFor="estado">Estado:</label>
        <input type="text" id="estado" name="estado" required />
        <br />
        <button type="button" onClick={handleBack}>Voltar</button>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}