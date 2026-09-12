# Especificações do Projeto

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Gerente |	Ter controle de todo meu estoque de produtos |	Evitar desperdícios financeiros e de alimentos
| Gerente |	Receber alertas de estoque baixo e de validade próxima do fim	| Ser informado quando precisar repor um produto ou quando houver risco de perda por vencimento |
| Gerente |	Receber previsões de curto e longo prazo de quando os produtos irão acabar |	Saber antecipadamente quando precisarei realizar a compra dos produtos |
| Gerente |	Poder adicionar e excluir produtos, além de editar as informações dos produtos já cadastrados |	Poder manter o estoque atualizado sempre que necessário |
| Gerente |	Poder registrar entradas, saídas e perdas de produtos |	Manter um histórico das movimentações e saber por que a quantidade de um produto foi alterada |
| Gerente |	Poder adicionar no sistema o cardápio semanal do restaurante |	Utilizar o cardápio nas previsões de consumo e nas demais funcionalidades do sistema |
| Gerente |	Poder informar o consumo médio dos produtos de acordo com o cardápio e o dia da semana |	Permitir que o sistema calcule o consumo previsto dos produtos |
| Gerente |	Receber automaticamente a previsão de consumo diário dos produtos com base no cardápio |	Facilitar o controle do estoque e reduzir a necessidade de atualizações manuais |
| Gerente |	Receber previsões de gastos com alimentos para períodos diários, semanais e mensais |	Saber antecipadamente quanto deverá gastar com alimentos |
| Gerente |	Receber sugestões de compra com base no estoque atual e no consumo previsto |	Planejar antecipadamente a reposição dos produtos |
| Gerente |	Consultar o histórico de movimentações dos produtos |	Acompanhar as alterações realizadas no estoque e identificar perdas ou consumos |
| Gerente |	Organizar os produtos em categorias |	Facilitar a localização e o gerenciamento dos produtos |
| Gerente |	Cadastrar a unidade de medida dos produtos |	Controlar corretamente quantidades como kg, litros e unidades |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| A aplicação deve permitir que o usuário adicione produtos ao estoque | ALTA |
|RF-002| A aplicação deve permitir que o usuário exclua produtos do estoque | ALTA |
|RF-003| A aplicação deve permitir que o usuário modifique as informações dos produtos cadastrados, incluindo quantidade, validade e custo | ALTA |
|RF-004| A aplicação deve permitir que o usuário crie categorias para organizar os produtos | ALTA |
|RF-005| A aplicação deve permitir que o usuário exclua categorias existentes | ALTA |
|RF-006| A aplicação deve permitir que o usuário modifique categorias existentes | ALTA |
|RF-007| A aplicação deve permitir que o usuário adicione o cardápio semanal, com as informações de consumo previstas para cada dia da semana | ALTA |
|RF-008| A aplicação deve permitir que o usuário modifique o cardápio semanal, alterando as receitas e o consumo previsto para cada dia da semana | ALTA |
|RF-009| A aplicação deve calcular os gastos previstos com produtos em períodos diários, semanais e mensais | ALTA |
|RF-010| A aplicação deve calcular a previsão de consumo dos produtos e informar quando será necessária a reposição | ALTA |
|RF-011| A aplicação deve sugerir a quantidade de produtos a ser reposta com base no estoque atual e no consumo previsto | ALTA |
|RF-012| A aplicação deve enviar alertas para o usuário sempre que um produto estiver com baixo estoque ou com a validade próxima do vencimento | ALTA |
|RF-013| A aplicação deve exigir que o usuário faça login sempre que abrir o sistema | ALTA |
|RF-014| A aplicação deve permitir que o usuário cadastre a unidade de medida dos produtos | ALTA |
|RF-015| A aplicação deve permitir que o usuário registre entradas, saídas e perdas de produtos | ALTA |
|RF-016| A aplicação deve disponibilizar ao usuário um painel com as principais informações do estoque | ALTA |
|RF-017| A aplicação deve permitir que o usuário consulte o histórico de movimentações do estoque | ALTA |
|RF-018| A aplicação deve permitir que o usuário consulte os produtos cadastrados no estoque | ALTA |

### Requisitos não Funcionais

| **ID** | **Descrição do Requisito** | **Prioridade** |
| ------ | -------------------------- | -------------- |
| RNF-001 | A aplicação deve ser responsiva, adaptando sua interface a diferentes tamanhos de tela e dispositivos. | MÉDIA |
| RNF-002 | A aplicação deve processar requisições do usuário em no máximo 3 segundos em condições normais de uso. | BAIXA |
| RNF-003 | A aplicação deve possuir uma interface intuitiva e de fácil utilização, permitindo que o usuário realize as principais operações sem conhecimentos técnicos avançados. | MÉDIA |
| RNF-004 | A aplicação deve garantir a integridade dos dados armazenados, evitando alterações ou exclusões não autorizadas. | ALTA |
| RNF-005 | A aplicação deve garantir a segurança das informações de autenticação do usuário, impedindo o acesso não autorizado à conta. | ALTA |
| RNF-006 | A aplicação deve apresentar mensagens claras ao usuário durante operações de sucesso, erro ou validação de dados. | MÉDIA |
| RNF-007 | A aplicação deve manter um padrão visual consistente entre suas telas, utilizando elementos de interface, cores, botões e menus de forma padronizada. | BAIXA |

## Diagrama de Casos de Uso

<img width="1416" height="2894" alt="Diagrama Casos de Uso RESTFILL" src="https://github.com/user-attachments/assets/d3483e5b-cb54-413e-9554-6d2b7c34562b" />




