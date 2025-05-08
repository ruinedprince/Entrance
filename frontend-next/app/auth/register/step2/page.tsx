"use client";

import "@/app/globals.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "@/app/components/FormContainer";
import InputField from "@/app/components/InputField";
import BackButton from "@/app/components/BackButton";
import GreetingText from "@/app/components/GreetingText";
import LoginButton from "@/app/components/PatternButton";

export default function RegisterStep2() {
  const router = useRouter();
  const [step1Data, setStep1Data] = useState(null);
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

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
      cpf,
      data_nascimento: dataNascimento,
      cep,
      endereco,
      cidade,
      estado,
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
    <div className="flex flex-col items-center place-content-center h-screen p-[20px]">
      <FormContainer>
        <BackButton />
        <GreetingText text="INFORMAÇÕES ADICIONAIS" />
        <form onSubmit={handleSubmit}>
          <div className="flex gap-5 mb-5">
            <InputField
              type="text"
              id="cpf"
              name="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="CPF"
              required
            />
            <InputField
              type="date"
              id="data_nascimento"
              name="data_nascimento"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              placeholder="Data de Nascimento"
              required
            />
          </div>
          <div className="mb-5">
            <InputField
              type="text"
              id="endereco"
              name="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço"
              required
            />
          </div>
          <div className="flex gap-5 mb-5">
            <InputField
              type="text"
              id="cep"
              name="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Digite seu CEP"
              required
            />
            <InputField
              type="text"
              id="cidade"
              name="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Digite sua Cidade"
              required
            />
            <select
              id="estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-3 text-[12px] font-bold font-poppins border border-[#171717] text-[#171717] rounded focus:outline-none focus:ring-2 focus:ring-[#171717] transition-all duration-500 ease-in-out bg-transparent"
              required
            >
              <option value="">Selecione o Estado</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
          </div>
          <LoginButton>CADASTRAR</LoginButton>
        </form>
        <div
          className="h-px my-5 border-t"
          style={{
            borderImage: "linear-gradient(to right, #21CF63, #8A35CE) 1",
          }}
        ></div>
        <div className="flex flex-col gap-4">
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
          </p>{" "}
        </div>
      </FormContainer>
    </div>
  );
}

