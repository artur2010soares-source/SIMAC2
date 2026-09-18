import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';
import type { AlertLevel, CargoItem, SensorMeta } from '../../types';
import { SensorPoint } from './SensorPoint';
import { CargoBox } from './CargoBox';
import { MODEL_URLS } from '../../utils/assets';

interface TruckModelProps {
  cargoItems: CargoItem[];
  sensors: SensorMeta[];
  selectedSensorId: string | null;
  onSelectSensor: (id: string) => void;
  cargoAlert: AlertLevel;
  cabinAlert: AlertLevel;
  overloaded: boolean;
  unbalanced: boolean;
}

// A carroceria/plataforma não vem no modelo (é um chassi nu), então é
// construída aqui em código — isso garante que o piso, os sensores e as
// caixas fiquem sempre alinhados entre si, em vez de depender de coordenadas
// chutadas dentro de uma malha importada.
const BED_Z_START = 1.15;
const BED_Z_END = 5.85;
const BED_LENGTH = BED_Z_END - BED_Z_START;
const BED_CENTER_Z = (BED_Z_START + BED_Z_END) / 2;
const BED_Y = 1.0;
const BED_HALF_WIDTH = 1.0;

function CargoBed({ accent }: { accent: string }) {
  return (
    <group>
      {/* piso da carroceria */}
      <mesh position={[0, BED_Y, BED_CENTER_Z]} receiveShadow castShadow>
        <boxGeometry args={[BED_HALF_WIDTH * 2, 0.08, BED_LENGTH]} />
        <meshStandardMaterial color="#242c38" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* grades laterais */}
      {[-BED_HALF_WIDTH, BED_HALF_WIDTH].map((x) => (
        <mesh key={x} position={[x, BED_Y + 0.28, BED_CENTER_Z]}>
          <boxGeometry args={[0.04, 0.5, BED_LENGTH]} />
          <meshStandardMaterial color="#2f3a4a" transparent opacity={0.55} />
        </mesh>
      ))}
      {/* faixa luminosa indicando status da carga */}
      <mesh position={[0, BED_Y + 0.041, BED_CENTER_Z]}>
        <boxGeometry args={[BED_HALF_WIDTH * 1.9, 0.012, BED_LENGTH * 0.96]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function TruckModel({
  cargoItems,
  sensors,
  selectedSensorId,
  onSelectSensor,
  cargoAlert,
  cabinAlert,
  overloaded,
  unbalanced,
}: TruckModelProps) {
  const { scene } = useGLTF(MODEL_URLS.truck);
  const truckScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // "Object_2" é a casca do baú/carroceria fechada do modelo original.
        // Deixamos ela semi-transparente (efeito "raio-x" de gêmeo digital)
        // para que a carga e os sensores continuem visíveis por dentro —
        // do contrário, tudo ficaria escondido atrás de uma parede opaca.
        if (mesh.name === 'Object_2') {
          const original = mesh.material as MeshStandardMaterial;
          const ghostMaterial = original.clone();
          ghostMaterial.transparent = true;
          ghostMaterial.opacity = 0.22;
          ghostMaterial.depthWrite = false;
          ghostMaterial.side = THREE.DoubleSide;
          mesh.material = ghostMaterial;
          mesh.renderOrder = 10;
          mesh.castShadow = false;
        }
      }
    });
    return clone;
  }, [scene]);

  const cabinLedRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (cabinLedRef.current) {
      const pulse = cabinAlert === 'critico' ? Math.abs(Math.sin(state.clock.elapsedTime * 6)) : 1;
      const material = cabinLedRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = cabinAlert === 'normal' ? 0.8 : cabinAlert === 'atencao' ? 1.4 : 1.2 + pulse * 1.6;
    }
  });

  const cabinColor = cabinAlert === 'critico' ? '#ff4d6a' : cabinAlert === 'atencao' ? '#ffb648' : '#34e5a8';
  const chassisAccent = overloaded ? '#ff4d6a' : unbalanced ? '#ffb648' : '#2ad9ff';

  return (
    <group>
      {/* Modelo 3D real: cabine + chassi + rodas (Volkswagen Delivery 9.150) */}
      <primitive object={truckScene} />

      {/* Carroceria/plataforma construída em código */}
      <CargoBed accent={chassisAccent} />

      {/* LED de status da cabine, próximo ao teto */}
      <mesh ref={cabinLedRef} position={[0, 2.42, -0.1]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={cabinColor} emissive={cabinColor} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>

      {/* Cargas na carroceria */}
      {cargoItems.map((item, i) => (
        <CargoBox key={item.id} item={item} stackIndex={i} highlight={overloaded || unbalanced} />
      ))}

      {/* Sensores clicáveis */}
      {sensors.map((sensor) => (
        <SensorPoint
          key={sensor.id}
          sensor={sensor}
          active={selectedSensorId === sensor.id}
          alerting={sensor.kind === 'carga' ? cargoAlert !== 'normal' : cabinAlert !== 'normal'}
          onSelect={onSelectSensor}
        />
      ))}
    </group>
  );
}

useGLTF.preload(MODEL_URLS.truck);
