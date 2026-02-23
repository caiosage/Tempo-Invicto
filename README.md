# Tempus Invictus

Protótipo de acompanhamento de sobriedade com temática de disciplina pessoal.

## Contexto do protótipo

Ao abrir o aplicativo, o usuário configura sua batalha principal (ex.: alcoolismo, cigarro, pornografia, redes sociais) e define:

- Nome do vício/inimigo
- Data de início da sobriedade
- Tipo de meta:
  - `40 dias de sobriedade` (Quaresma do Guerreiro)
  - `Sobriedade permanente` (Tempus Invictus)
  - `Data final personalizada`
- Gasto recorrente com o vício (`diário`, `semanal` ou `mensal`)

Com base nesses dados, o app mostra:

- Dias invictos
- Ouro preservado (valor economizado)
- Gráfico de pizza com distribuição do ouro preservado
- Ritual de retorno (registro após queda)

## Stack

- React 18
- TypeScript
- Zustand
- Vite
- Tailwind CSS

## Como rodar localmente

## 1) Instalar dependências

```bash
npm install
```

## 2) Subir em modo desenvolvimento

```bash
npm run dev
```

## 3) Abrir no navegador

Normalmente:

```text
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

## Preview do build

```bash
npm run preview
```

## Observações

- Estado é persistido em `localStorage` usando a chave `tempus-invictus-templo-v1`.

## Demonstração
<img width="1049" height="905" alt="image" src="https://github.com/user-attachments/assets/7afb652c-4550-45d8-8d18-b7d0162c7360" />
<img width="1454" height="924" alt="image" src="https://github.com/user-attachments/assets/a1e67472-74f1-4556-aa82-350e64103b72" />



