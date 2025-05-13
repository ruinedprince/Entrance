-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS entrance;
USE entrance;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    confirmacao_email VARCHAR(100),
    senha VARCHAR(255) NOT NULL,
    confirmacao_senha VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpf VARCHAR(14),
    telefone VARCHAR(15),
    data_nascimento DATE,
    cep VARCHAR(10),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    tipo_usuario VARCHAR(20) DEFAULT 'participante'
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    local VARCHAR(255) NOT NULL,
    organizador_id INT,
    descricao TEXT,
    data_inicio TIMESTAMP NOT NULL,
    data_final TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo',
    cidade VARCHAR(100),
    estado VARCHAR(100),
    capa TEXT,
    slug VARCHAR(255) UNIQUE,
    FOREIGN KEY (organizador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de ingressos
CREATE TABLE IF NOT EXISTS ingressos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    evento_id INT,
    foto TEXT,
    status VARCHAR(20) DEFAULT 'disponivel',
    quantidade_disponivel INT NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_final TIMESTAMP NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

-- Tabela de fotos
CREATE TABLE IF NOT EXISTS fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url TEXT NOT NULL,
    evento_id INT,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

-- Índices adicionais
CREATE INDEX idx_email_usuarios ON usuarios(email);
CREATE INDEX idx_data_eventos ON eventos(data_inicio);