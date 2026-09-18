import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { SensorMeta } from '../../types';

interface SensorPointProps {
  sensor: SensorMeta;
  active: boolean;
  alerting: boolean;
  onSelect: (id: string) => void;
}

export function SensorPoint({ sensor, active, alerting, onSelect }: SensorPointProps) {
  const [hovered, setHovered] = useState(false);
  const color = alerting ? '#ff4d6a' : sensor.kind === 'carga' ? '#2ad9ff' : '#34e5a8';

  return (
    <group position={sensor.position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(sensor.id);
        }}
        scale={hovered || active ? 1.4 : 1}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={alerting ? 2.4 : hovered || active ? 1.6 : 0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.09, 24]} />
        <meshBasicMaterial color={color} transparent opacity={hovered || active ? 0.9 : 0.4} toneMapped={false} />
      </mesh>

      {(hovered || active) && (
        <Html distanceFactor={7} position={[0, 0.18, 0]} center zIndexRange={[100, 0]}>
          <div className="sensor-tooltip">
            <strong>{sensor.label}</strong>
            <span>{sensor.description}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
