"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect, Suspense, Component, type ReactNode } from "react";
import * as THREE from "three";

type ProgressRef = { current: number };

// 0 below edge0, 1 above edge1, smooth in between
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function FallbackModel() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.5;
  });
  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
      <meshStandardMaterial color="#4FE6FF" metalness={0.9} roughness={0.1} wireframe />
    </mesh>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn("GLTF failed, showing fallback:", error.message);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function ClearColor() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(new THREE.Color(0x000000), 0);
  }, [gl]);
  return null;
}

function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    smooth.current.x += (mouse.current.x - smooth.current.x) * 0.04;
    smooth.current.y += (mouse.current.y - smooth.current.y) * 0.04;
  });

  return smooth;
}

function HeroModel({ progressRef }: { progressRef: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/hero3Dmodel.glb");
  const mouse = useMouseParallax();
  const isDesktop = useRef(true);

  useEffect(() => {
    const check = () => {
      isDesktop.current = window.innerWidth >= 1024;
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ccccd4"),
      metalness: 1.0,
      roughness: 0.08,
      envMapIntensity: 2.2,
    });
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = mat;
      }
    });
    return clone;
  }, [scene]);

  const { scaleFactor, center } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return { scaleFactor: maxDim > 0 ? 4 / maxDim : 1, center: c };
  }, [cloned]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const p = progressRef.current;

    // choreography phases
    const appear = smoothstep(0.1, 0.32, p); // scale 0 -> full, centered
    const toRight = smoothstep(0.34, 0.54, p); // center -> right
    const rot = smoothstep(0.54, 1.0, p); // extra rotation
    const b3 = smoothstep(0.72, 1.0, p); // lean toward viewer / spark

    // scale in from 0
    groupRef.current.scale.setScalar(scaleFactor * appear * (1 + b3 * 0.05));

    // slide to the right (desktop split only)
    const targetX = (isDesktop.current ? 2.0 : 0) * toRight;

    groupRef.current.position.set(
      -center.x * scaleFactor + targetX + Math.sin(t * 0.25) * 0.03,
      -center.y * scaleFactor + Math.sin(t * 0.6) * 0.06,
      -center.z * scaleFactor + b3 * 0.4
    );

    // scroll drives rotation; mouse + idle layered on top
    groupRef.current.rotation.set(
      my * 0.06 + Math.sin(t * 0.4) * 0.02 + b3 * 0.12,
      mx * 0.12 + Math.sin(t * 0.3) * 0.04 + rot * Math.PI * 0.9,
      0
    );
  });

  return (
    <group ref={groupRef} scale={0}>
      <primitive object={cloned} />
    </group>
  );
}

function AccentLights({ progressRef }: { progressRef: ProgressRef }) {
  const cyanRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const b3 = smoothstep(0.66, 1.0, progressRef.current);
    cyanRef.current.intensity = 0.5 + Math.sin(t * 2) * 0.2 + b3 * 2.5;
    cyanRef.current.position.set(
      Math.sin(t * 0.5) * 2 * (1 - b3),
      1 + Math.cos(t * 0.7) * 1.5 * (1 - b3),
      3
    );
  });

  return (
    <>
      <pointLight
        ref={cyanRef}
        color="#4FE6FF"
        intensity={0.5}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[-2, -2, 2]}
        color="#4FE6FF"
        intensity={0.12}
        distance={8}
        decay={2}
      />
    </>
  );
}

function SceneContent({ progressRef }: { progressRef: ProgressRef }) {
  return (
    <>
      <ClearColor />
      <Environment preset="studio" background={false} environmentIntensity={1.4} />

      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 10, 7]} intensity={1.1} color="#f0f0ff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#8ab4f8" />
      <hemisphereLight args={["#d0d4e8", "#0a0a14", 0.25]} />
      <AccentLights progressRef={progressRef} />

      <ModelErrorBoundary fallback={<FallbackModel />}>
        <Suspense fallback={<FallbackModel />}>
          <HeroModel progressRef={progressRef} />
        </Suspense>
      </ModelErrorBoundary>
    </>
  );
}

export default function HeroScene({
  progressRef,
}: {
  progressRef?: ProgressRef;
}) {
  const [mounted, setMounted] = useState(false);
  const localRef = useRef(0);
  const pr = progressRef ?? localRef;
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stop rendering entirely once the hero scrolls off screen —
  // otherwise the GPU keeps drawing behind every section below.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  return (
    <div
      ref={hostRef}
      style={{ width: "100%", height: "100%", minHeight: 350, background: "transparent" }}
    >
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 42 }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            powerPreference: "high-performance",
          }}
          dpr={1}
          frameloop={inView ? "always" : "never"}
          style={{ background: "transparent" }}
        >
          <SceneContent progressRef={pr} />
        </Canvas>
      )}
    </div>
  );
}

useGLTF.preload("/hero3Dmodel.glb");
