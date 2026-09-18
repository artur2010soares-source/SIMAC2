import { useEffect, useRef } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { initialCargoItems } from '../data/initialState';
import { computeEfficiency, totalGrossWeight } from '../utils/calculations';
import type { DemoStep } from '../types';

export const DEMO_SEQUENCE: DemoStep[] = [
  'sistema-normal',
  'adicionar-carga',
  'desbalanceamento',
  'deteccao',
  'temperatura',
  'co',
  'alerta',
  'resultado',
];

export const DEMO_STEP_INFO: Record<DemoStep, { title: string; description: string }> = {
  idle: { title: '', description: '' },
  'sistema-normal': {
    title: 'Etapa 1 · Sistema normal',
    description: 'Cabine e carga dentro dos parâmetros ideais. Todos os indicadores em verde.',
  },
  'adicionar-carga': {
    title: 'Etapa 2 · Adicionando carga',
    description: 'Uma nova carga é posicionada na carroceria e o peso total é recalculado.',
  },
  desbalanceamento: {
    title: 'Etapa 3 · Carga desbalanceada',
    description: 'A carga é deslocada para um dos lados, gerando desbalanceamento na distribuição.',
  },
  deteccao: {
    title: 'Etapa 4 · Detecção do problema',
    description: 'O SIMAC² analisa os dados das células de carga e identifica o desbalanceamento.',
  },
  temperatura: {
    title: 'Etapa 5 · Temperatura em alta',
    description: 'A temperatura da cabine sobe e se aproxima do limite considerado seguro.',
  },
  co: {
    title: 'Etapa 6 · CO em alta',
    description: 'A concentração de monóxido de carbono aumenta na cabine.',
  },
  alerta: {
    title: 'Etapa 7 · Alerta gerado',
    description: 'O sistema combina as leituras e emite um alerta crítico com LED e buzzer virtuais.',
  },
  resultado: {
    title: 'Etapa 8 · Resultado final',
    description: 'A simulação é registrada no histórico com o status observado nesta demonstração.',
  },
};

const STEP_MS = 4300;
const FINAL_HOLD_MS = 7000;

export function useDemoRunner() {
  const { state, setCargoItems, addCargo, setCabin, setDemoStep, setDemoRunning, addHistory, setOverload } =
    useSimulation();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.demoRunning) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      return;
    }

    const step = state.demoStep;
    const idx = DEMO_SEQUENCE.indexOf(step);

    switch (step) {
      case 'sistema-normal':
        setOverload(false);
        setCargoItems(initialCargoItems);
        setCabin({ temperatureC: 27, humidityPct: 52, coPpm: 10 });
        break;
      case 'adicionar-carga':
        addCargo({
          name: 'Carga demonstrativa — paletes pesados',
          weightKg: 3200,
          position: 'traseira',
          lateralOffset: 0.1,
        });
        break;
      case 'desbalanceamento':
        addCargo({
          name: 'Carga demonstrativa — excesso lateral',
          weightKg: 4200,
          position: 'traseira',
          lateralOffset: 1,
        });
        break;
      case 'temperatura':
        setCabin({ temperatureC: 36.5 });
        break;
      case 'co':
        setCabin({ coPpm: 38 });
        break;
      case 'resultado': {
        const finalGross = totalGrossWeight(state.cargoItems);
        const finalEfficiency = computeEfficiency(state.cargoItems);
        addHistory({
          id: `demo-${Date.now()}`,
          code: `SIMULAÇÃO ${String(state.history.length + 1).padStart(3, '0')}`,
          label: 'Demonstração automática',
          status: 'critico',
          timestamp: new Date().toLocaleString('pt-BR'),
          totalWeightKg: finalGross,
          efficiencyPct: finalEfficiency,
        });
        break;
      }
      default:
        break;
    }

    if (idx === -1 || idx === DEMO_SEQUENCE.length - 1) {
      timeoutRef.current = window.setTimeout(() => {
        setDemoRunning(false);
        setDemoStep('idle');
      }, FINAL_HOLD_MS);
    } else {
      timeoutRef.current = window.setTimeout(() => {
        setDemoStep(DEMO_SEQUENCE[idx + 1]);
      }, STEP_MS);
    }

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.demoRunning, state.demoStep]);
}
