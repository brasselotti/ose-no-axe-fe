# Osé no Axé

## Capa e identificação
>Fabiano Brasselotti dos Santos
>
>20230030400
>
>ECT3699 - Desenvolvimento Web Front End - T01
>
>Título: Osé no Axé
>
>Slogan:  Para dar um axé na administração do seu terreiro;

## Descrição geral
<OséNoAxé />

Uma aplicação web em React feita para membros de terreiros de candomblé, que (em sua fase inicial) realiza cadastros e gerencia registros de pagamentos de mensalidades, em páginas objetivas e claras.

O Terreiro da Prata (Ilê Axé Afinká), tomado como referência para desenvolvimento deste projeto, está situado no município de Macaíba-RN, no qual o autor deste trabalho é um membro ativo.

Considerando a vivência no espaço, pôde-se notar problemas como: a falta de conhecimento integral sobre os filhos da casa e ineficiência tecnológica para o controle de pagamento de mensalidades que gera retrabalhos contínuos;

O sistema oferece interfaces para gerir o cadastro de pessoas no banco de dados e os pagamentos de mensalidades, tudo isso buscando um maior conhecimento sobre os membros e principalmente extinguir problemas que são causados pelo retrabalho manual com a atual gestão de planilhas.

Não pretendemos tornar o "Osé no Axé" em uma rede social, onde os membros interajam entre si e nem uma plataforma para realizar propriamente os pagamentos, como um banco digital.

## Público-alvo & Personas
O "Osé no Axé" foi pensado para a utilização na comunidade de membros de terreiros de candomblé. Será importante a distinção entre dois tipos de "perfil", um para administradores, que possam acessar todas as informações a respeito dos membros cadastrados, e o segundo tipo para membros simples, onde será possível atualizar suas informações pessoais no cadastro e também solicitar o registro de seu pagamento de mensalidade, através da inclusão de um comprovante.

Essas demandas se fazem importantes para que haja uma fidelidade quanto aos dados dos membros, para assim se tornar possível um melhor conhecimento das pessoas que frequentam a casa, e para acabar com o retrabalho atual no contexto em que a atualização da situação de regularidade de pagamentos é feito através de grupos do whatsapp, repassando listas repetidamente a cada vez em que um membro realiza o pagamento.

## Listagem de funcionalidades
MUST-01 // Cadastro
Como filho da casa, quero me registrar no banco de dados da casa para salvar os meus dados.
-> Critérios de aceitação:
  - Validação de CPF (Um cadastro por pessoa);
  - Validação de login (Não repetir login de outros membros);
  - Data de bori (Somente se torna filho após o bori);
  - Redireciona para /home após sucesso;

MUST-02 // Edição de cadastro
Como filho da casa, quero atualizar os dados do meu cadastro de forma a mantê-los atualizados.
-> Critérios de aceitação:
  - Precisa estar logado;
  - Para salvar, precisa confirmar com senha;

MUST-03 // Registro de pagamento de mensalidade
Como filho da casa, quero solicitar a baixa no pagamento mensal, para constar a regularidade.
-> Critérios de aceitação:
  - Precisa estar logado;
  - Precisa enviar um comprovante (em imagem ou PDF);
  - Será aceito mediante avaliação de um ADM;
  - Para confirmar, solicita-se a senha;

MUST-04 // Listagem de regularidade dos membros
Como ADM, quero visualizar a situação dos filhos para poder estimar o valor pendente a receber no mês.
-> Critérios de aceitação:
  - Funcionalidade disponível apenas para cadastros do tipo ADM;
  - Dashboard para visualização mediante filtros de pesquisa;

MUST-05 // Avaliação de pagamentos
Como ADM, quero dar baixa na solicitação de pagamento de um filho, para garantir que o relatório de situação esteja atualizado.
-> Critérios de aceitação:
  - Funcionalidade disponível apenas para cadastros do tipo ADM;
  - Possibilidade de decisão mediante visualização ou não do comprovante enviado;

MUST-06 // Alteração no tipo de perfil 
Como ADM, quero alterar o tipo de conta de um membro, para alguém possa acessar ou deixar de ter acesso à funcionalidades do sistema.
-> Critérios de aceitação:
  - Funcionalidade disponível apenas para cadastros do tipo ADM;
  - Notificação para confirmação da ação ao tentar salvar;

NICE-01 // Notificação de situação
Como filho da casa, serei notificado em caso de pendência financeira mensal, para que esteja ciente e possa quitar a dívida.

NICE-02 // Extrato financeiro
Como filho da casa ou ADM, quero acessar à um extrato de movimentações, para ter clareza sobre o destino dos valores de mensalidade pagos.

NICE-03 // Movimentação financeira
Como ADM, quero registrar uma movimentação de entrada ou saída de caixa para atualizar o extrato financeiro.

## Mapa do site
```text
├── /cadastro                        # pública  
├── /login                           # pública  
├── /app                             # protegida - requer login  
├── /app/home                        # dashboard  
├── /app/cadastros                   #   
│  ├── app/cadastros/novo             # somente para ADMs  
│  ├── app/cadastros/editar           # para todos os users  
├── /app/mensalidades                #  
│  ├── app/mensalidades/list          # dashboard para ADMs  
│  └── app/mensalidades/list/:id      # dinâmica  
│  ├── app/mensalidades/registrar     # para todos os users  
│  ├── app/mensalidades/analisar      # somente para ADMs  
```

## Wireframes
### Home Page
![Home page](/images/app-home.png)
### Página de cadastros
![Cadastros](/images/app-cadastros.png)
### Página para registrar pagamento de mensalidade
![Registrar pagamento](/images/app-mensalidades-registrar.png)

## Slack técnica
1. React
2. GitHub
3. JavaScript
4. CSS
5. Vite

## Fontes de dados
Os dados serão obtidos de forma presencial, no próprio terreiro, os mesmos serão alocados em um arquivo JSON local.

## Riscos e atenções

## Cronograma pessoal
25/05/2026
- Criação de repositório no GitHub;
- Início do documento para entrega;
- Branch "roteiro" criada;
- Adequação de textos pré-existentes (projeto de disciplina "Programação Avançada"):
  - Descrição geral;
  - Público-alvo & personas;
- Sumário criado em arquivo README.md;
---
26/06/2026
- Desenvolvimento dos tópicos à serem entregues:
  - Listagem de funcionalidades;
  - Mapa do site;
  - Criação de wireframes no Figma;
  - Slack técnica;
  - Fonte de dados;
  - Cronograma pessoal;
- Conteúdos do roteiro adicionados e commitados;