drop database bywomen;
CREATE DATABASE bywomen;
USE bywomen;

CREATE TABLE categoria_servico (
	cod_cat_servico int primary key auto_increment,
    imagem_categoria varchar(500),
    nome_cat_servico varchar(100)
)ENGINE=InnoDB;
INSERT INTO categoria_servico (imagem_categoria, nome_cat_servico) VALUES 
('assistencia-tecnica.svg', 'Assistência Técnica'),
('autos.svg', 'Autos'),
('construcao.svg', 'Construção'),
('design-tecnologia.svg','Design e Tecnologia'),
('moda-beleza.svg', 'Moda e Beleza'),
('reformas-reparos.svg', 'Reformas e Reparos'),
('servicos-domesticos.svg','Serviços Domesticos');

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
    foto_perfil longblob,
    criadoEm datetime
)ENGINE=InnoDB;

CREATE TABLE usuario_colaboradora (
	id_colaboradora VARCHAR(36),
    id_usuario VARCHAR(36),
    descricao varchar(500),
    cod_plano int,
    criadoEm datetime,
    primary key(id_colaboradora, id_usuario),
    CONSTRAINT foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
    foreign key (cod_plano) references planos (cod_plano)
)ENGINE=InnoDB;

CREATE TABLE favoritos (
	cod_fav VARCHAR(36) primary key,
    id_colaboradora VARCHAR(36),
    cod_cat_servico int,
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
    cod_cat_servico int,
    CONSTRAINT foreign key (cod_cat_servico) references categoria_servico (cod_cat_servico) on delete cascade
)ENGINE=InnoDB;

INSERT INTO profissao (nome_profissao, foto_profissao, cod_cat_servico) VALUES 
("Técnica em manutenção de pc's", 'tecnica-em-manutencao.jpg',1),
('Profissional de áudio', 'profissional-de-audio.jpg',1),
('Antenista', 'antenista.jpg',1),
('Eletricista', 'eletricista.jpg',1),

('Mecânica', 'mecanica.jpg',2),
('Importadora de peças', 'importadora-de-pecas.jpg',2),
('Instrutora de autoescola', 'instrutora-de-autoescola.jpg',2),
('Consultora automotiva', 'consultora-automotiva.jpg',2),

('Pedreira', 'pedreira.jpg',3),
('Encanadora', 'encanadora.jpg',3),
('Azulejista', 'azulejista.jpg',3),
('Vidraceira', 'vidraceira.jpg',3),
('Arquiteta', 'arquiteta.jpg',3),
('Engenheira', 'engenheira.jpg',3),
('Empreiteira', 'empreiteira.jpg',3),
('Designer de interiores', 'designer-de-interiores.jpg',3),

('Desenvolvedora de sistemas', 'desenvolvedora.jpg',4),
('Marketing', 'marketing.jpg',4),
('Designer', 'designer.jpg',4),
('Fotógrafa', 'fotografa.jpg',4),
('Video maker', 'video-maker.jpg', 4),
('Redatora', 'redatora.jpg', 4),

('Estilista', 'estilista.jpg',5),
('Designer de acessorios', 'designer-de-acessorios.jpg',5),
('Modelista', 'modelista.jpg',5),
('Costureira', 'costureira.jpg',5),
('Cabeleireira', 'cabeleireira.jpg',5),
('Manicure e pedicure', 'manicure-e-pedicure.jpg',5),
('Esteticista', 'esteticista.jpg',5),
('Designer de sobrancelhas', 'designer-de-sobrancelhas.jpg',5),
('Maquiadora', 'maquiadora.jpg',5),
('Massagista', 'massagista.jpg',5),

('Azulejista', 'azulejista.jpg',6),
('Jardineira', 'jardineira.jpg',6),
('Soldadora', 'soldadora.jpg',6),
('Chaveira', 'chaveira.jpg',6),
('Piscineira', 'piscineira.jpg',6),

('Diarista', 'diarista.jpg',7),
('Cozinheira', 'cozinheira.jpg',7),
('Babá', 'baba.jpg',7),
('Motorista', 'motorista.jpg',7),
('Governanta', 'governanta.jpg',7),
('Cuidadora de idosos', 'cuidadora-de-idosos.jpg',7);



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
    CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE solicitacao(
	cod_solicitacao VARCHAR(36) primary key,
    mensagem varchar(500),
    status_solicitacao varchar(50),
    data_requisicao date,
    periodo varchar(50),
    id_usuario VARCHAR(36),
    CONSTRAINT foreign key (id_usuario) references usuario (id_usuario) on delete cascade
)ENGINE=InnoDB;

CREATE TABLE solicitacao_colaboradora(
	cod_solicitacao VARCHAR(36),
    id_colaboradora varchar(36),
    CONSTRAINT foreign key (cod_solicitacao) references solicitacao (cod_solicitacao) on delete cascade,
	CONSTRAINT foreign key (id_colaboradora) references usuario_colaboradora (id_colaboradora) on delete cascade
)ENGINE=InnoDB;