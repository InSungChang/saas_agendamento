-- MySQL Script generated by MySQL Workbench
-- Mon Sep  9 22:04:07 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema agendar
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `agendar` ;

-- -----------------------------------------------------
-- Schema agendar
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `agendar` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `agendar` ;

-- -----------------------------------------------------
-- Table `agendar`.`empresas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`empresas` ;

CREATE TABLE IF NOT EXISTS `agendar`.`empresas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `endereco` VARCHAR(255) NULL DEFAULT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`clientes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`clientes` ;

CREATE TABLE IF NOT EXISTS `agendar`.`clientes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `endereco` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `empresa_id` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `clientes_ibfk_1`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `agendar`.`empresas` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`profissionais`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`profissionais` ;

CREATE TABLE IF NOT EXISTS `agendar`.`profissionais` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `cor` VARCHAR(7) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  `ativo` ENUM('Ativo', 'Inativo') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `empresa_id` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `profissionais_ibfk_1`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `agendar`.`empresas` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`servicos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`servicos` ;

CREATE TABLE IF NOT EXISTS `agendar`.`servicos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `duracao` INT NOT NULL,
  `preco` DECIMAL(10,2) NOT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descricao` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `empresa_id` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `servicos_ibfk_1`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `agendar`.`empresas` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`agendamentos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`agendamentos` ;

CREATE TABLE IF NOT EXISTS `agendar`.`agendamentos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  `profissional_id` INT NOT NULL,
  `servico_id` INT NOT NULL,
  `data_horario_agendamento` DATETIME NOT NULL,
  `status` ENUM('agendado', 'concluido', 'cancelado') NULL DEFAULT 'agendado',
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `empresa_id` (`empresa_id` ASC) VISIBLE,
  INDEX `cliente_id` (`cliente_id` ASC) VISIBLE,
  INDEX `profissional_id` (`profissional_id` ASC) VISIBLE,
  INDEX `servico_id` (`servico_id` ASC) VISIBLE,
  CONSTRAINT `agendamentos_ibfk_1`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `agendar`.`empresas` (`id`),
  CONSTRAINT `agendamentos_ibfk_2`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `agendar`.`clientes` (`id`),
  CONSTRAINT `agendamentos_ibfk_3`
    FOREIGN KEY (`profissional_id`)
    REFERENCES `agendar`.`profissionais` (`id`),
  CONSTRAINT `agendamentos_ibfk_4`
    FOREIGN KEY (`servico_id`)
    REFERENCES `agendar`.`servicos` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 90
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`cancelamentos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`cancelamentos` ;

CREATE TABLE IF NOT EXISTS `agendar`.`cancelamentos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  `profissional_id` INT NOT NULL,
  `servico_id` INT NOT NULL,
  `data_horario_cancelado` DATETIME NOT NULL,
  `status` ENUM('agendado', 'concluido', 'cancelado') NULL DEFAULT 'cancelado',
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `empresa_id` (`empresa_id` ASC) VISIBLE,
  INDEX `cliente_id` (`cliente_id` ASC) VISIBLE,
  INDEX `profissional_id` (`profissional_id` ASC) VISIBLE,
  INDEX `servico_id` (`servico_id` ASC) VISIBLE,
  CONSTRAINT `cancelamentos_ibfk_1`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `agendar`.`empresas` (`id`),
  CONSTRAINT `cancelamentos_ibfk_2`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `agendar`.`clientes` (`id`),
  CONSTRAINT `cancelamentos_ibfk_3`
    FOREIGN KEY (`profissional_id`)
    REFERENCES `agendar`.`profissionais` (`id`),
  CONSTRAINT `cancelamentos_ibfk_4`
    FOREIGN KEY (`servico_id`)
    REFERENCES `agendar`.`servicos` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 90
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`disponibilidades`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`disponibilidades` ;

CREATE TABLE IF NOT EXISTS `agendar`.`disponibilidades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `profissional_id` INT NOT NULL,
  `dia_semana` ENUM('Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo') NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fim` TIME NOT NULL,
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `profissional_id` (`profissional_id` ASC) VISIBLE,
  CONSTRAINT `disponibilidades_ibfk_1`
    FOREIGN KEY (`profissional_id`)
    REFERENCES `agendar`.`profissionais` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 94
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`profissional_servicos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`profissional_servicos` ;

CREATE TABLE IF NOT EXISTS `agendar`.`profissional_servicos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `profissional_id` INT NOT NULL,
  `servico_id` INT NOT NULL,
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `profissional_id` (`profissional_id` ASC) VISIBLE,
  INDEX `servico_id` (`servico_id` ASC) VISIBLE,
  CONSTRAINT `profissional_servicos_ibfk_1`
    FOREIGN KEY (`profissional_id`)
    REFERENCES `agendar`.`profissionais` (`id`),
  CONSTRAINT `profissional_servicos_ibfk_2`
    FOREIGN KEY (`servico_id`)
    REFERENCES `agendar`.`servicos` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `agendar`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agendar`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `agendar`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `papel` ENUM('admin', 'funcionario') NOT NULL,
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  INDEX `empresa_id` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `usuarios_ibfk_1`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `agendar`.`empresas` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
