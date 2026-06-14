'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';

type Variant = 'petals' | 'bubbles';

type ParticleProps = {
  density?: number;
  variant?: Variant;
};

type ParticleState = {
  position: [number, number, number];
  speed: number;
  drift: number;
  rotationSpeed: number;
  scale: number;
};

function Particles({ count, variant }: { count: number; variant: Variant }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo<ParticleState[]>(
    () =>
      Array.from({ length: count }, () => ({
        position: [(Math.random() - 0.5) * 10, Math.random() * 10 - 5, (Math.random() - 0.5) * 4],
        speed: 0.008 + Math.random() * 0.012,
        drift: (Math.random() - 0.5) * 0.012,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        scale: variant === 'bubbles' ? 0.08 + Math.random() * 0.22 : 0.14 + Math.random() * 0.22,
      })),
    [count, variant],
  );

  useFrame(() => {
    if (!mesh.current) return;

    particles.forEach((particle, index) => {
      particle.position[1] -= particle.speed;
      particle.position[0] += particle.drift;

      if (particle.position[1] < -5.4) particle.position[1] = 5.4;
      if (particle.position[0] > 5.6) particle.position[0] = -5.6;
      if (particle.position[0] < -5.6) particle.position[0] = 5.6;

      dummy.position.set(...particle.position);
      dummy.rotation.set(0, 0, particle.position[1] * particle.rotationSpeed);
      dummy.scale.set(particle.scale, particle.scale * (variant === 'petals' ? 0.58 : 1), particle.scale);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, count]}>
      {variant === 'bubbles' ? <sphereGeometry args={[0.45, 16, 16]} /> : <circleGeometry args={[0.5, 16]} />}
      <meshBasicMaterial
        color={variant === 'bubbles' ? '#ffffff' : '#ffd6d6'}
        transparent
        opacity={variant === 'bubbles' ? 0.28 : 0.62}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function CssFallback({ density = 18, variant = 'petals' }: ParticleProps) {
  const items = useMemo(
    () =>
      Array.from({ length: density }, (_, index) => ({
        id: index,
        x: Math.random() * 100,
        delay: Math.random() * 9,
        duration: 10 + Math.random() * 10,
        size: 10 + Math.random() * 18,
        drift: -28 + Math.random() * 56,
      })),
    [density],
  );

  return (
    <div className="particle-layer css-particles" aria-hidden="true">
      {items.map((item) => (
        <span
          className={variant === 'bubbles' ? 'css-bubble' : 'css-petal'}
          key={item.id}
          style={
            {
              left: `${item.x}%`,
              width: item.size,
              height: item.size,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              '--particle-drift': `${item.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function PetalParticles({ density = 20, variant = 'petals' }: ParticleProps) {
  const [mode, setMode] = useState<'checking' | 'three' | 'css'>('checking');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency < 4;
    const webgl = 'WebGLRenderingContext' in window;
    setMode(reduced || lowPower || !webgl ? 'css' : 'three');
  }, []);

  if (mode !== 'three') {
    return <CssFallback density={mode === 'checking' ? Math.min(density, 12) : density} variant={variant} />;
  }

  return (
    <div className="particle-layer" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.35]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Particles count={density} variant={variant} />
      </Canvas>
    </div>
  );
}
