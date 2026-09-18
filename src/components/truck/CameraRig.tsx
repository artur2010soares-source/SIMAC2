import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { ViewPreset } from '../../types';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrbitControlsImpl = any;

// Coordenadas em metros, calibradas para o novo modelo (cabine curta,
// carroceria construída em código de z=1.15 a 5.85 — ver TruckModel.tsx).
const PRESETS: Record<ViewPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  orbit: { pos: [6.8, 4.2, 8.2], target: [0, 1.1, 2.6] },
  frontal: { pos: [0, 1.7, -5.2], target: [0, 1.2, -0.4] },
  lateral: { pos: [6.8, 1.5, 2.6], target: [0, 1.0, 2.6] },
  superior: { pos: [0.01, 9.5, 2.6], target: [0, 0.5, 2.6] },
};

interface CameraRigProps {
  preset: ViewPreset;
  controlsRef: React.MutableRefObject<OrbitControlsImpl>;
}

// Aplica o preset de câmera diretamente (posição + alvo) e deixa o
// OrbitControls recalcular seu estado interno a partir disso. Uma tentativa
// anterior interpolava a posição quadro a quadro enquanto o OrbitControls
// também escrevia na câmera todo frame — os dois brigavam e a câmera nunca
// chegava de fato no preset escolhido (por isso os botões pareciam não
// fazer nada). Aplicar de uma vez, numa única passada, resolve isso.
export function CameraRig({ preset, controlsRef }: CameraRigProps) {
  const { camera } = useThree();
  const firstRun = useRef(true);

  useEffect(() => {
    const p = PRESETS[preset];
    const controls = controlsRef.current;

    camera.position.set(...p.pos);

    if (controls) {
      controls.target.set(...p.target);
      controls.update();
    } else {
      camera.lookAt(...p.target);
    }

    firstRun.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return null;
}

export { PRESETS };
