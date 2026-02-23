# Tempus Invictus

> "Quem domina o tempo, domina a si."

Tempus Invictus não é apenas um rastreador de hábitos. É um templo digital de vigilância interior, onde cada batalha recebe nome, cada queda recebe verdade, e cada dia sóbrio retorna como ouro e tempo reconquistados.

## Visão Filosófica

Este projeto parte de uma tese simples: a liberdade não nasce da negação da queda, mas da repetição consciente do retorno.

- O vício é tratado como inimigo nomeado, não como abstração.
- A sobriedade é tratada como rito, não como evento isolado.
- O progresso é tratado como transmutação: do chumbo ao ouro.

## Escopo Atual

Ao iniciar, o guerreiro configura uma ou mais batalhas com:

- Inimigo da vigília (seleção temática)
- Data de início da sobriedade
- Meta:
  - 40 dias (Quaresma do Guerreiro)
  - Permanente (∞)
  - Personalizada
- Tempo drenado pelo inimigo (diário/semanal/mensal)
- Tributo em ouro (quando aplicável)
- Informações adicionais opcionais (proventos mensais)

## Regras de Negócio Implementadas

## 1) Batalhas com e sem ouro

- Para `brain rot` e `redes sociais`, o sistema remove o componente de ouro.
- Nesses casos:
  - O onboarding oculta o bloco de ouro.
  - O Templo oculta cards e gráfico de ouro quando apenas essas batalhas estão selecionadas.

## 2) Meta de sobriedade

- Meta de 40 dias ajusta automaticamente a data final com base na data inicial.
- Meta permanente exibe símbolo de infinito (∞).
- Meta personalizada exige data final válida.

## 3) Queda e ritual obrigatório

- Ao clicar em `Registrar Queda`, o app redireciona para a página do Ritual de Retorno.
- O retorno ao Templo depende de `Selar Ritual de Retorno` com campos preenchidos.
- Após selar, a contagem reinicia para o novo ciclo.

## 4) Múltiplas batalhas e filtros

- É possível registrar múltiplas batalhas.
- Gráficos respeitam checkboxes de seleção por batalha.
- Há descritivo explícito das batalhas consideradas nos cálculos.

## 5) Sessão bônus: Time is Money

Com base em proventos mensais opcionais, o sistema estima equivalências de valor/hora (modelo CLT comum):

- 8h por dia
- 5 dias por semana

A sessão bônus converte tempo poupado em valor monetário equivalente e exibe projeções no gráfico.

## Validações Funcionais (QA)

- Build TypeScript + Vite validado.
- Fluxo de queda e retorno validado.
- Correção de persistência visual após queda (filtros e projeções).
- Correções de acentuação e textos temáticos validadas.
- Tooltips de explicação adicionados para transparência de cálculo.

## Stack

- React 18
- TypeScript
- Zustand
- Vite
- Tailwind CSS

## Como Executar

## 1) Instalar dependências

```bash
npm install
```

## 2) Rodar em desenvolvimento

```bash
npm run dev
```

## 3) Acessar no navegador

```text
http://localhost:5173
```

## 4) Build de produção

```bash
npm run build
```

## 5) Preview da build

```bash
npm run preview
```

## Persistência

- Estado salvo em `localStorage` na chave:
  - `tempus-invictus-templo-v1`

## Nota de Privacidade

- O campo de proventos mensais é opcional e utilizado apenas para estimativas locais no próprio navegador.
- Não há backend persistindo dados sensíveis nesta versão do protótipo.

## Síntese

Tempus Invictus não mede perfeição. Mede retorno.
Cada dia lúcido é matéria-prima.
Cada escolha sóbria é forja.
Cada batalha nomeada é um passo da sombra para o ouro.

## Observações

- Estado é persistido em `localStorage` usando a chave `tempus-invictus-templo-v1`.

## Demonstração
<img width="976" height="919" alt="image" src="https://github.com/user-attachments/assets/da9ae657-791a-4cec-99e7-dba7a450a991" />
<img width="1201" height="855" alt="image" src="https://github.com/user-attachments/assets/c00c36ef-3de0-4ac0-9588-c13080564e2e" />
<img width="1029" height="615" alt="image" src="https://github.com/user-attachments/assets/90c8ca8c-b2c8-4402-8c73-3c0d312c23f4" />








