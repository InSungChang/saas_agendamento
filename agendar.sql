CREATE DATABASE agendar;
USE agendar;

CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id) ON DELETE CASCADE
);

CREATE TABLE permissoes (
    permissao_id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE usuario_permissoes (
    usuario_id INT NOT NULL,
    permissao_id INT NOT NULL,
    PRIMARY KEY (usuario_id, permissao_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (permissao_id) REFERENCES permissoes(permissao_id) ON DELETE CASCADE
);

CREATE TABLE historico_sessoes (
    sessao_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    cliente_id INT NOT NULL,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME,
    status VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id) ON DELETE CASCADE
);

-- Inserindo clientes
INSERT INTO clientes (nome, email) VALUES ('Cliente1', 'cliente1@teste.com');
INSERT INTO clientes (nome, email) VALUES ('Cliente2', 'cliente2@teste.com');

-- Inserindo usuários
INSERT INTO usuarios (cliente_id, nome, email, senha) VALUES (1, 'Usuário1', 'usuario1@teste.com', '$2a$10$X9.9jOa8bDoizQomUJZsueLzYxFpP.Oy5SbW5X9Jf6vMcp3Yr1pzG'); -- senha: senha123
INSERT INTO usuarios (cliente_id, nome, email, senha) VALUES (2, 'Usuário2', 'usuario2@teste.com', '$2a$10$X9.9jOa8bDoizQomUJZsueLzYxFpP.Oy5SbW5X9Jf6vMcp3Yr1pzG'); -- senha: senha123

-- Inserindo permissões
INSERT INTO permissoes (descricao) VALUES ('admin');
INSERT INTO permissoes (descricao) VALUES ('user');

-- Associando usuários a permissões
INSERT INTO usuario_permissoes (usuario_id, permissao_id) VALUES (1, 1); -- Usuário 1 como admin
INSERT INTO usuario_permissoes (usuario_id, permissao_id) VALUES (2, 2); -- Usuário 2 como user

-- Inserindo histórico de sessões
INSERT INTO historico_sessoes (usuario_id, cliente_id, data_hora_inicio) VALUES (1, 1, '2024-08-01 10:00:00');
INSERT INTO historico_sessoes (usuario_id, cliente_id, data_hora_inicio) VALUES (2, 2, '2024-08-01 11:00:00');

