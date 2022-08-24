drop database bywomen;
CREATE DATABASE bywomen;
USE bywomen;

CREATE TABLE categoria_servico (
	cod_cat_servico bigint primary key,
    nome_cat_servico varchar(100)
);

CREATE TABLE planos (
 cod_plano int primary key auto_increment,
 nome_plano varchar(50),
 valor_plano decimal(4,2),
 periodo varchar(50),
 beneficios varchar(350)
);

CREATE TABLE usuario (
	id_usuario VARCHAR(36) primary key,
	cpf_usuario varchar(20),
    nome varchar(100),
    email varchar(100),
    num_tel varchar(20),
    senha varchar(255),
    cep varchar(10),
    foto_perfil varchar(255)
);

CREATE TABLE usuario_colaboradora (
	id_colaboradora VARCHAR(36),
    id_usuario VARCHAR(36),
    descricao varchar(500),
    cod_plano int,
    primary key(id_colaboradora, id_usuario),
    foreign key (id_usuario) references usuario (id_usuario),
    foreign key (cod_plano) references planos (cod_plano)
);

CREATE TABLE favoritos (
	cod_fav bigint primary key,
    id_colaboradora VARCHAR(36),
    cod_cat_servico bigint,
    id_usuario VARCHAR(36),
    foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora),
    foreign key (cod_cat_servico) references categoria_servico (cod_cat_servico),
    foreign key (id_usuario) references usuario (id_usuario)
);

CREATE TABLE comentarios(
	cod_comentario VARCHAR(36),
    conteudo varchar (500),
    id_colaboradora varchar(36),
    id_usuario VARCHAR(36),
	foreign key (id_usuario) references usuario (id_usuario),
    foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora)
);

CREATE TABLE certificacao(
	cod_certificacao bigint primary key,
    orgao_emissor varchar(100),
    nome_curso varchar (100),
    data_emissao date,
    id_colaboradora varchar(36),
    foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora)
);

CREATE TABLE trabalhos_realizados(
	cod_trabalho bigint primary key,
    titulo varchar(100),
    descricao varchar(500),
    imagem_trabalho varchar (255),
    id_colaboradora varchar(36),
    cod_cat_servico bigint,
    foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora),
    foreign key (cod_cat_servico) references categoria_servico (cod_cat_servico)
);

CREATE TABLE tipo_servico(
	cod_tipo_servico bigint primary key,
    nome_tipo_servico varchar(100),
    img_tipo_servico varchar(255),
    cod_cat_servico bigint,
    foreign key (cod_cat_servico) references categoria_servico (cod_cat_servico)
);

CREATE TABLE profissao(
	cod_profissao bigint primary key,
    nome_profissao varchar(100),
    cod_tipo_servico bigint,
    foreign key (cod_tipo_servico) references tipo_servico (cod_tipo_servico)
);

CREATE TABLE profissao_colaboradora(
	id_colaboradora varchar(36),
    cod_profissao bigint,
	primary key (id_colaboradora, cod_profissao),
    foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora),
    foreign key (cod_profissao) references profissao (cod_profissao)
);

CREATE TABLE servico(
	cod_servico bigint primary key,
    cep varchar(15),
    data_hora_servico datetime,
    complemento_local varchar(100),
    num_local int,
    id_colaboradora varchar(36),
    cod_tipo_servico bigint,
    foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora),
    foreign key (cod_tipo_servico) references tipo_servico (cod_tipo_servico)
);

CREATE TABLE solicitacao(
	cod_solicitacao bigint primary key,
    mensagem varchar(500),
    status_solicitacao varchar(50),
    data_requisicao date,
    periodo varchar(50),
    cod_tipo_servico bigint,
    id_usuario VARCHAR(36),
    foreign key (cod_tipo_servico) references tipo_servico (cod_tipo_servico),
    foreign key (id_usuario) references usuario (id_usuario)
);

CREATE TABLE solicitacao_colaboradora(
	cod_solicitacao bigint,
    id_colaboradora varchar(36),
    foreign key (cod_solicitacao) references solicitacao (cod_solicitacao),
    foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora)
);