# Arquitetura da Solução

## Diagrama de Classes

<img width="1640" height="1226" alt="Diagrama de Classe RESTFILL" src="https://github.com/user-attachments/assets/fef48099-8968-4af2-92c3-a870603eb163" />

## Modelo ER (Projeto Conceitual)

<img width="1361" height="1078" alt="Diagrama ER RESTFILL" src="https://github.com/user-attachments/assets/0de206de-0e2e-4857-97c7-e24c159c6875" />

## Projeto da Base de Dados

GERENTE(
    idGerente INT PK,
    nome VARCHAR(20),
    senha VARCHAR(20)
)

CATEGORIA(
    idCategoria INT PK,
    nome VARCHAR(50),
    descricao VARCHAR(255),
    icone VARCHAR(255),
    cor VARCHAR(20)
)

UNIDADEMEDIDA(
    idUnidadeMedida INT PK,
    nome VARCHAR(30),
    tipo VARCHAR(30)
)

PRODUTO(
    idProduto INT PK,
    nome VARCHAR(50),
    custoPorKg DECIMAL(10,2),
    validade DATETIME,
    quantidade DECIMAL(10,2),
    quantidadeMinima DECIMAL(10,2),
    descricao VARCHAR(255),
    idCategoria INT FK → CATEGORIA(idCategoria),
    idUnidadeMedida INT FK → UNIDADEMEDIDA(idUnidadeMedida)
)

MOVIMENTACAO(
    idMovimentacao INT PK,
    idGerente INT FK → GERENTE(idGerente),
    idProduto INT FK → PRODUTO(idProduto),
    quantidade DECIMAL(10,2),
    tipo VARCHAR(30),
    custo DECIMAL(10,2),
    data DATETIME,
    observacao VARCHAR(255)
)

REFEICAO(
    idRefeicao INT PK,
    nome VARCHAR(50),
    descricao VARCHAR(255)
)

INGREDIENTE(
    idIngrediente INT PK,
    quantidade DECIMAL(10,2),
    idRefeicao INT FK → REFEICAO(idRefeicao),
    idProduto INT FK → PRODUTO(idProduto)
)

CARDAPIO(
    idCardapio INT PK,
    nome VARCHAR(50),
    descricao VARCHAR(255),
    ativo BOOL
)

ITEMCARDAPIO(
    idItemCardapio INT PK,
    diaDaSemana VARCHAR(20),
    quantidadePrevista DECIMAL(10,2),
    periodo DATETIME,
    idCardapio INT FK → CARDAPIO(idCardapio),
    idRefeicao INT FK → REFEICAO(idRefeicao)
)

## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

> **Links Úteis**:
>
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting Started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando Seu Site No Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)
