-- Criação do banco de dados
CREATE DATABASE entrance;

-- Conectar ao banco de dados
\c entrance;

-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpf VARCHAR(14),
    telefone VARCHAR(15),
    data_nascimento DATE,
    cidade VARCHAR(100),
    estado VARCHAR(2)
);

-- Tabela de eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data TIMESTAMP NOT NULL,
    local VARCHAR(255) NOT NULL,
    organizador_id INT REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de ingressos
CREATE TABLE ingressos (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    evento_id INT REFERENCES eventos(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'disponivel'
);

-- Tabela de fotos
CREATE TABLE fotos (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    evento_id INT REFERENCES eventos(id) ON DELETE CASCADE,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices adicionais
CREATE INDEX idx_email_usuarios ON usuarios(email);
CREATE INDEX idx_data_eventos ON eventos(data);