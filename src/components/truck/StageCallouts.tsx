import { Html, Line } from '@react-three/drei';
import type { ReactNode } from 'react';

interface CalloutProps {
  anchor: [number, number, number];
  labelPos: [number, number, number];
  icon: ReactNode;
  title: string;
  subtitle?: string;
  tone?: 'cyan' | 'green';
}

function Callout({ anchor, labelPos, icon, title, subtitle, tone = 'cyan' }: CalloutProps) {
  const color = tone === 'cyan' ? '#2ad9ff' : '#34e5a8';
  return (
    <group>
      <Line points={[anchor, labelPos]} color={color} lineWidth={1.4} transparent opacity={0.65} />
      <mesh position={anchor}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <Html position={labelPos} center distanceFactor={7.5} zIndexRange={[50, 0]}>
        <div className="stage-callout">
          <span className="stage-callout__icon">{icon}</span>
          <div>
            <strong>{title}</strong>
            {subtitle && <span>{subtitle}</span>}
          </div>
        </div>
      </Html>
    </group>
  );
}

interface StageCalloutsProps {
  totalWeightKg: number;
}

export function StageCallouts({ totalWeightKg }: StageCalloutsProps) {
  return (
    <>
      <Callout
        anchor={[0, 1.55, 3.5]}
        labelPos={[0, 3.05, 3.5]}
        icon="⚖"
        title="Carga atual"
        subtitle={`${totalWeightKg.toLocaleString('pt-BR')} kg`}
      />
      <Callout
        anchor={[0.85, 0.16, 5.7]}
        labelPos={[2.3, 1.7, 5.9]}
        icon="📡"
        title="Sensor de carga"
        tone="green"
      />
      <Callout anchor={[0, 0.02, 1.6]} labelPos={[0, -1.05, 0.4]} icon="🖥" title="Plataforma de pesagem" tone="green" />
    </>
  );
}
