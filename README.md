# Osé no Axé
![Logo](/images/logo.png)

## Identificação
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

Uma aplicação web em React feita para membros de terreiros de candomblé, que (em sua fase inicial) realiza cadastros e gerencia registros de pagamentos de mensalidades por meio de páginas objetivas e claras.

O Terreiro da Prata (Ilê Axé Afinká), tomado como referência para desenvolvimento deste projeto, está situado no município de Macaíba-RN, no qual o autor deste trabalho é um membro ativo.

Considerando a vivência no espaço, pôde-se notar problemas como: a falta de conhecimento integral sobre os filhos da casa e ineficiência tecnológica para o controle de pagamento de mensalidades que gera retrabalhos contínuos;

O sistema oferece interfaces para gerir o cadastro de pessoas no banco de dados e os pagamentos de mensalidades, tudo isso buscando um maior conhecimento sobre os membros e extinguir problemas que são causados pelo retrabalho manual com a atual gestão de planilhas.

Não pretendemos tornar o "Osé no Axé" em uma rede social, onde os membros interajam entre si e nem uma plataforma para realizar os pagamentos, como um banco digital.

## Público-alvo & Personas
O "Osé no Axé" foi pensado para a utilização na comunidade de membros de terreiros de candomblé. Será importante a distinção entre dois tipos de perfis: um para administradores, que tenham acesso integral às funcionalidades do aplicativo; outro para membros simples, onde será possível atualizar suas informações pessoais de cadastro e solicitar o registro de seu pagamento mensal, através do envio de um comprovante.

Essas demandas se fazem importantes para que haja uma fidelidade quanto aos dados dos membros, e para otimizar o controle de mensalidades, que atualmente é feito através de grupos do whatsapp, repassando listas repetidamente a cada vez em que um membro realiza o pagamento.

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
├── /cadastro                              # pública
├── /login                                 # pública
└── /app                                   # protegida - requer login
   ├── /app/home                           # dashboard
   ├── /app/cadastros                      # app de cadastros
   │  ├── /app/cadastros/novo              # somente para ADMs
   │  └── /app/cadastros/editar            # para todos os users
   └── /app/mensalidades                   # app de mensalidades
      ├── /app/mensalidades/registrar      # para todos os users
      ├── /app/mensalidades/analisar       # somente para ADMs
      └── /app/mensalidades/list           # dashboard para ADMs
         └── /app/mensalidades/list/:id    # dinâmica
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
- O sistema não fará uma validação de dados, portanto é importante que no momento de cadastro, o membro se certifique sobre os dados cadastrados;
- Para que os relatórios se mantenham fiéis, é importante que os ADM's verifiquem constantemente as solicitações de pagamento de mensalidades;
- Para o acesso à alguns dados específicos dos membros, os ADM's precisam passar por uma validação através de senha;
- Os membros comuns cadastrados não podem ter acesso à informações pessoais dos demais membros;

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
26/05/2026
- Desenvolvimento dos tópicos à serem entregues:
  - Listagem de funcionalidades;
  - Mapa do site;
  - Criação de wireframes no Figma;
  - Slack técnica;
  - Fonte de dados;
  - Cronograma pessoal;
- Conteúdos do roteiro adicionados e commitados;
---
27/06/2026
- Criação de nova branch develop;
- Utilização de Claude Code para guiar a criação do projeto;
  - Criação de reset.css;
  - Sugestão para melhorar estrutura de pastas e Apps;
  - Instalação e configuração do React Router;
  - Lógica de login e autenticação (MUST-01);
---
29/06/2026
- Utilização do Claude Code para criar cronograma de 3 dias de trabalho;  
- Dia 1 (layout e app de cadastros):  
  - Criação da sidebar e layout das páginas do app (Navbar, Layout);  
  - Integração do layout e proteção de rotas por perfil (AdminRoute);  
  - Seed do banco de dados com usuário ADM padrão;  
  - Adição de funções de leitura e atualização no banco de dados;  
  - Implementação do dashboard na homepage (atalhos e visão geral);  
  - Implementação do app de cadastros: listagem de membros, novo cadastro e edição de cadastro (MUST-02, MUST-06);  
---
30/06/2026
- Dia 2 (app de mensalidades e melhorias no app de cadastros):
  - Adição de funções CRUD de mensalidades ao banco de dados;
  - Adição de classes globais de UI (form-section, badges, nav-cards);
  - Implementação da página de Perfil com auto-edição de dados acessível pela Navbar (MUST-02);
  - Implementação do app de mensalidades:
    - Página inicial com navegação adaptada por tipo de perfil;
    - Registro de pagamento de mensalidade (MUST-03);
    - Analisar pagamentos: aprovação e rejeição de solicitações (MUST-05);
    - Regularidade: dashboard de adimplência e tabela por membro/mês (MUST-04);
    - Histórico individual de pagamentos por membro;
---
01/07/2026
- Utilização de Claude Code para organizar commits do dia anterior;