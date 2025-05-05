"use client";

import React, { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    cidade: "",
    estado: "",
    tipo_usuario: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        estado: formData.estado.slice(0, 2).toUpperCase(), // Garante que o estado tenha no máximo 2 caracteres
      };

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
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
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="telefone">Telefone:</label>
        <input
          type="text"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="data_nascimento">Data de Nascimento:</label>
        <input
          type="date"
          id="data_nascimento"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="cidade">Cidade:</label>
        <input
          type="text"
          id="cidade"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="estado">Estado:</label>
        <input
          type="text"
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="tipo_usuario">Tipo de Usuário:</label>
        <select
          id="tipo_usuario"
          name="tipo_usuario"
          value={formData.tipo_usuario}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="participante">Participante</option>
          <option value="produtor">Produtor</option>
        </select>
        <br />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}