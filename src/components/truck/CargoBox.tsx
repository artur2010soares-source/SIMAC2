import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { CargoItem } from '../../types';
import { MODEL_URLS } from '../../utils/assets';

// Posições ao longo do comprimento real da carroceria (metros, ver TruckModel.tsx).
const POSITION_Z: Record<CargoItem['position'], number> = {
  dianteira: 1.9,
  centro: 3.5,
  traseira: 5.1,
};

const DECK_Y = 1.04; // topo do piso da carroceria (BED_Y + metade da espessura)
const CRATE_BASE_SIZE = 0.62; // tamanho aproximado da caixa 3D original (metros)

interface CargoBoxProps {
  item: CargoItem;
  stackIndex: number;
  highlight: boolean;
}

export function CargoBox({ item, stackIndex, highlight }: CargoBoxProps) {
  const { scene } = useGLTF(MODEL_URLS.crate);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const scale = useMemo(() => Math.max(0.55, Math.min(1.25, item.weightKg / 1400)), [item.weightKg]);

  const columns = 3;
  const col = stackIndex % columns;
  const row = Math.floor(stackIndex / columns) % 2;
  const level = Math.floor(stackIndex / (columns * 2));

  const spacing = CRATE_BASE_SIZE * scale + 0.06;
  const x = Math.max(-0.8, Math.min(0.8, item.lateralOffset * 0.75)) + (col - 1) * spacing * 0.5;
  const z = POSITION_Z[item.position] + (row - 0.5) * spacing * 0.7;
  const y = DECK_Y + (CRATE_BASE_SIZE * scale) / 2 + level * (CRATE_BASE_SIZE * scale + 0.03);

  return (
    <group position={[x, y, z]} scale={scale}>
      <primitive object={cloned} />
      {highlight && (
        <mesh position={[0, CRATE_BASE_SIZE / 2 + 0.02, 0]}>
          <boxGeometry args={[CRATE_BASE_SIZE * 1.02, 0.01, CRATE_BASE_SIZE * 1.02]} />
          <meshStandardMaterial color="#ffb648" emissive="#ffb648" emissiveIntensity={0.8} />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload(MODEL_URLS.crate);
