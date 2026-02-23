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
<img width="976" height="919" alt="image" src="https://github.com/user-attachments/assets/da9ae657-791a-4cec-99e7-dba7a450a991" />
<img width="1201" height="855" alt="image" src="https://github.com/user-attachments/assets/c00c36ef-3de0-4ac0-9588-c13080564e2e" />
<img width="1029" height="615" alt="image" src="https://github.com/user-attachments/assets/90c8ca8c-b2c8-4402-8c73-3c0d312c23f4" />








