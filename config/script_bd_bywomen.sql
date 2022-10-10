drop database bywomen;
CREATE DATABASE bywomen;
USE bywomen;

CREATE TABLE categoria_servico (
	cod_cat_servico bigint primary key,
    nome_cat_servico varchar(100)
)ENGINE=InnoDB;

CREATE TABLE planos (
 cod_plano int primary key auto_increment,
 nome_plano varchar(50),
 valor_plano decimal(4,2),
 periodo varchar(50),
 beneficios varchar(350)
)ENGINE=InnoDB;

CREATE TABLE usuario (
	id_usuario VARCHAR(36) primary key,
	cpf_usuario varchar(20),
    nome varchar(100),
    email varchar(100),
    num_tel varchar(20),
    senha varchar(255),
    cep varchar(10),
    foto_perfil longblob
)ENGINE=InnoDB;

CREATE TABLE usuario_colaboradora (
	id_colaboradora VARCHAR(36),
    id_usuario VARCHAR(36),
    descricao varchar(500),
    cod_plano int,
    primary key(id_colaboradora, id_usuario),
    CONSTRAINT foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
    foreign key (cod_plano) references planos (cod_plano)
)ENGINE=InnoDB;

CREATE TABLE favoritos (
	cod_fav VARCHAR(36) primary key,
    id_colaboradora VARCHAR(36),
    cod_cat_servico bigint,
    id_usuario VARCHAR(36),
    CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade,
    CONSTRAINT foreign key (cod_cat_servico) references categoria_servico (cod_cat_servico) on delete cascade,
    CONSTRAINT foreign key (id_usuario) references usuario (id_usuario) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE comentarios(
	cod_comentario VARCHAR(36),
    conteudo varchar (500),
    id_colaboradora varchar(36),
    id_usuario VARCHAR(36),
	CONSTRAINT foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
    CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE certificacao(
	cod_certificacao VARCHAR(36) primary key,
    nome_curso varchar (100),
    atividade_realizada varchar(500),
    data_emissao date,
    orgao_emissor varchar(100),
    foto_certificacao longblob,
    id_colaboradora varchar(36),
    CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE trabalhos_realizados(
	cod_trabalho VARCHAR(36) primary key,
    titulo varchar(100),
    descricao varchar(500),
    imagem_trabalho longblob,
    id_colaboradora varchar(36),
    CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE profissao(
	cod_profissao int primary key auto_increment,
    nome_profissao varchar(100),
    foto_profissao varchar(500),
    cod_cat_servico bigint,
    CONSTRAINT foreign key (cod_cat_servico) references categoria_servico (cod_cat_servico) on delete cascade
)ENGINE=InnoDB;

INSERT INTO profissao (nome_profissao) VALUES ('teste-profissão1'),('teste-profissão2'),('teste-profissão3');

CREATE TABLE profissao_colaboradora(
	id_colaboradora varchar(36),
    cod_profissao int,
	primary key (id_colaboradora, cod_profissao),
    CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade,
    foreign key (cod_profissao) references profissao (cod_profissao)
)ENGINE=InnoDB;

CREATE TABLE servico(
	cod_servico VARCHAR(36) primary key,
    cep varchar(15),
    data_hora_servico datetime,
    complemento_local varchar(100),
    num_local int,
    id_colaboradora varchar(36),
    cod_tipo_servico VARCHAR(36),
    CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE solicitacao(
	cod_solicitacao VARCHAR(36) primary key,
    mensagem varchar(500),
    status_solicitacao varchar(50),
    data_requisicao date,
    periodo varchar(50),
    cod_tipo_servico VARCHAR(36),
    id_usuario VARCHAR(36),
    CONSTRAINT foreign key (id_usuario) references usuario (id_usuario) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE solicitacao_colaboradora(
	cod_solicitacao VARCHAR(36),
    id_colaboradora varchar(36),
    CONSTRAINT foreign key (cod_solicitacao) references solicitacao (cod_solicitacao) on delete cascade,
	CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade
)ENGINE=InnoDB;