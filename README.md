# Controle de Atestados · GARBO

Sistema web para registrar e consultar atestados de funcionários (de dia, de hora e de doação de sangue), acompanhar o saldo de horas por período e listar os aniversariantes do mês.

## Funcionalidades

- **Login** com os usuários cadastrados na coleção `users` do Firestore.
- **Início**: resumo do período atual, atestados pendentes, atestados mais recentes e aniversariantes do mês.
- **Inclusão de atestados** (menu lateral ou botões das telas), sempre em modal:
  - atestado de dia: data de início e de término (o término não pode ser antes do início);
  - atestado de hora: data, hora de início e de término, modo (Comparecimento/Acompanhamento) e status (Confirmado/Pendente);
  - atestado de doação: data da doação e data da folga (opcional).
  - Antes de salvar, o sistema avisa quando já existe um atestado do mesmo funcionário no mesmo período.
- **Consulta de atestados** por tipo, funcionário (ou todos), período (1º de maio a 30 de abril), modo e status, com ordenação, paginação, alteração e exclusão. Os filtros ficam na URL.
- **Saldo de horas** do período e total de horas pendentes.
- **Aniversariantes** por mês, com versão para impressão.
- **Funcionários**: busca, inclusão, alteração e exclusão. Ao alterar a matrícula, os atestados vinculados acompanham a nova matrícula.
- **Usuários**: inclusão, alteração e exclusão. As senhas ficam ocultas na lista. Não é possível excluir o próprio usuário nem o último usuário.
- **Absenteísmo**: item de menu mantido; o relatório ainda não foi implementado.

## Tecnologias

- Angular 21 (componentes standalone, signals, detecção de mudanças sem zone.js)
- Angular Material 21 (Material 3) com datas em português (date-fns)
- Firebase 13 (Cloud Firestore) e Firebase Hosting
- Vitest para testes unitários

Requer Node.js 20.19+, 22.12+ ou 24+.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm start` | Servidor local em `http://localhost:4200`, usando o Firestore de produção |
| `npm run start:demo` | Servidor local com **dados fictícios em memória** (usuário `1000`, senha `1234`). Nada é gravado no Firestore |
| `npm test` | Testes unitários |
| `npm run build` | Build de produção em `dist/dashboard/browser` |
| `npm run deploy` | Build e publicação no Firebase Hosting (requer `firebase login`) |
| `npm run format` | Formata o código com Prettier |

## Estrutura

```
src/app/
  core/       autenticação, acesso a dados, modelos, conversão do formato do Firestore, services e utilitários
  layout/     estrutura com menu lateral e barra superior
  shared/     componentes reutilizáveis (confirmação, busca de funcionário, validadores, pipes)
  features/   telas: login, início, atestados, aniversariantes, funcionários, usuários, absenteísmo
```

O acesso a dados passa pela classe `DataStore` (`core/data/data-store.ts`). Em produção ela usa o Firestore (`firestore-data-store.ts`, com o SDK carregado sob demanda). No modo demonstração, o `angular.json` troca o provider por um banco em memória (`memory-data-store.ts`).

## Formato dos dados

O formato dos documentos no Firestore é o mesmo da versão anterior, para não exigir migração e permitir voltar à versão antiga se necessário:

- `certificates`: `registration`, `type` (`Atestado de dia`, `Atestado de hora` ou `Atestado de doação`), `startDay`, `endDay` e `dayOff` (`dd/MM/yyyy`), `startHour` e `endHour` (`HH:mm`), `mode`, `status`. Campos que não se aplicam ao tipo recebem `******************`, como antes.
- `employees`: `registration`, `name`, `birthday` (`dd/MM`).
- `users`: `username`, `name`, `password`, `gender`.

A conversão fica em `core/mappers`. A leitura aceita as variações digitadas nas telas antigas (ex.: `5/3/2025`, `8:30`). Registros com tipo ou data ilegível não aparecem nas consultas e são contados num aviso na tela de atestados.

## Segurança: pontos de atenção

- As regras do Firestore (`firestore.rules`) permitem leitura e escrita para qualquer pessoa até 14/07/2030.
- As senhas ficam em texto puro na coleção `users`, e o login é verificado no navegador.

Para proteger os dados de verdade, o próximo passo é migrar o login para o Firebase Authentication e restringir as regras do Firestore a usuários autenticados.
