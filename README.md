# SIMAC² — Gêmeo Digital (Digital Twin) Interativo

Simulação digital interativa do **SIMAC² — Sistema Inteligente para Monitoramento Ambiental de Cabine e Carga**.

Este site **não é um dashboard institucional comum**: é uma simulação 3D interativa que funciona como gêmeo digital
de um caminhão equipado com o SIMAC², permitindo visualizar o caminhão, adicionar cargas, alterar posições,
simular sobrecarga e desbalanceamento, alterar condições da cabine (CO, temperatura, umidade) e observar o
sistema reagir em tempo real — tudo com dados **simulados no navegador**, sem necessidade de backend ou hardware.

## ⚠️ Aviso importante

- O protótipo físico atual do projeto é **apenas uma maquete visual**, sem sensores instalados.
- Todos os valores exibidos aqui (peso, temperatura, umidade, CO, consumo, emissão) são **gerados pela simulação**
  no navegador. Consumo e impacto ambiental são **estimativas experimentais** de um modelo simplificado, não dados
  reais de veículo.

## Tecnologias

- React 18 + TypeScript
- Vite
- Three.js + React Three Fiber + Drei
- CSS moderno (sem framework de UI), com tema HUD/Indústria 4.0

## Como rodar localmente

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Acesse o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos finais ficam em `dist/`.

## Publicar no Vercel

1. Suba este repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em "New Project" e importe o repositório.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

## Publicar no GitHub Pages

1. No arquivo `vite.config.ts`, ajuste `base` para `'/nome-do-repositorio/'`.
2. Gere o build: `npm run build`.
3. Publique a pasta `dist` na branch `gh-pages` (manualmente ou com a action `peaceiris/actions-gh-pages`).

## Modelos 3D

O caminhão e a caixa de carga usam modelos `.glb` reais, em `public/models/`:

- `truck.glb` — Delivery Volkswagen 9.150, por **lael.eugenio** (Sketchfab), licença **CC BY 4.0**. O arquivo
  original é só cabine + chassi (sem carroceria); a plataforma de carga é construída em código
  (`TruckModel.tsx`, componente `CargoBed`) e a casca do baú original é renderizada semi-transparente para que a
  carga e os sensores continuem visíveis (efeito "raio-x" de gêmeo digital). Otimizado de 3,9 MB para ~1,9 MB.
- `crate.glb` — Caixa de madeira, por **TuszPro** (Sketchfab), licença **CC BY-NC-SA 4.0** (uso não comercial).
  Otimizada de 2,1 MB para ~120 KB.

Se for reaproveitar este projeto comercialmente, troque a caixa por um modelo com licença compatível — a licença
atual da caixa não permite uso comercial. Para trocar qualquer um dos dois modelos, substitua o `.glb`
correspondente em `public/models/` e ajuste as coordenadas em `src/data/initialState.ts` (sensores),
`src/components/truck/TruckModel.tsx` (dimensões da carroceria `CargoBed` e da câmera em `CameraRig.tsx`) e
`src/components/truck/CargoBox.tsx` (posição das cargas) conforme a escala do novo modelo.

## Estrutura do projeto

```
src/
  components/
    layout/     -> Header, navegação entre telas, badge de status
    truck/      -> Caminhão 3D, sensores, caixas de carga, câmera
    panels/     -> Painéis funcionais (carga, cabine, alertas, dashboard, sustentabilidade, histórico, sobre)
    ui/         -> Botões, cards, sliders, modal (primitivas reutilizáveis)
  context/      -> Estado global da simulação (React Context + useReducer)
  data/         -> Dados iniciais (cargas, cabine, sensores, histórico semente)
  hooks/        -> Métricas derivadas e execução do modo demonstração
  utils/        -> Cálculos de distribuição de peso, eficiência, consumo e emissão estimados
```

## Funcionalidades

- Caminhão 3D com rotação livre, zoom e vistas frontal / lateral / superior / livre
- 6 pontos de sensores clicáveis (4 células de carga + temperatura/umidade + CO) com tooltip e painel de valor
- Adição de cargas com nome, peso e posição, refletidas visualmente na carroceria
- Simulação de sobrecarga e detecção automática de desbalanceamento (longitudinal e lateral)
- Sliders funcionais de temperatura, umidade e CO, com reação automática do status do sistema
- Sistema de alertas em 3 níveis (normal / atenção / crítico) com LED, buzzer visual e explicação
- Dashboard com 8 indicadores em tempo real
- Seção de sustentabilidade com fluxo carga → eficiência → consumo → emissão e comparativo equilibrada × desbalanceada
- Fluxo animado sensores → ESP32 → processamento → análise → alerta → registro
- Modo demonstração automática (8 etapas, ~35 segundos)
- Modo apresentação (para feira científica), simplificando a interface
- Histórico de simulações (armazenado apenas no navegador)
- Espaço reservado para QR Code de acesso
- Layout responsivo (desktop, tablet e celular)
