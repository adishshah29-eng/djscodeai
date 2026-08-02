"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import * as THREE from "three";

function HeroModel() {
  const wrapperRef = useRef<THREE.Group>(null!);
  const gltf = useGLTF("/hero3Dmodel.glb");
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const { scaleFactor, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 5 / maxDim : 1;
    return { scaleFactor: s, offset: center };
  }, [clonedScene]);

  useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      metalness: 1.0,
      roughness: 0.08,
      color: new THREE.Color("#c8c8d0"),
      envMapIntensity: 1.8,
    });
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = mat;
      }
    });
  }, [clonedScene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    wrapperRef.current.position.y = Math.sin(t * 0.5) * 0.04;
  });

  return (
    <group
      ref={wrapperRef}
      scale={scaleFactor}
      position={[
        -offset.x * scaleFactor,
        -offset.y * scaleFactor,
        -offset.z * scaleFactor,
      ]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <Environment preset="studio" background={false} environmentIntensity={1.2} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-4, 3, -3]} intensity={0.3} color="#e0e0ff" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />

      <Suspense fallback={null}>
        <HeroModel />
      </Suspense>
    </>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 7], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={1}
        style={{ background: "transparent" }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/hero3Dmodel.glb");
