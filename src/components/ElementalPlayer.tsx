import { useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

import revealFragment from "../shaders/reveal.glsl?raw";

/* ===============================
   SHADER MATERIAL
================================ */

const RevealMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uReveal: 0,
  },
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  revealFragment
);

/* IMPORTANT: register material */
extend({ RevealMaterial });

/* ===============================
   COMPONENT
================================ */

type Props = {
  image: string;
  position: [number, number, number];
  delay?: number;
};

export function ElementalPlayer({
  image,
  position,
  delay = 0,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null);
  const texture = useTexture(image);

  /* Reveal + rotation sequence */
  useEffect(() => {
    if (!materialRef.current) return;

    gsap.to(materialRef.current.uniforms.uReveal, {
      value: 1,
      duration: 1.8,
      delay,
      ease: "power2.out",
    });

    gsap.fromTo(
      meshRef.current.rotation,
      { y: Math.PI },
      {
        y: 0,
        duration: 2,
        delay,
        ease: "power3.out",
      }
    );
  }, [delay]);

  /* Animate shader time */
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[2.2, 3]} />
      {/* MUST MATCH registered name */}
      <revealMaterial
        ref={materialRef}
        uTexture={texture}
        transparent
      />
    </mesh>
  );
}
