/* eslint-disable react/no-unknown-property */
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Plane } from "@react-three/drei";
import * as THREE from "three";
import Loader from "./Loader";
import { Typography } from "@mui/material";

const BrainModel = () => {
  const texture = useLoader(THREE.TextureLoader, "/obj/blender/Brain.png");
  const brain = useGLTF("/obj/blender/Brain2.gltf");

  const createCustomMaterial = (texture) => {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            varying vec2 vUv;
            
            void main() {
                // Simulate heatmap texture
                
                // Determine the vertical position (normalized)
                float t = clamp(vUv.y, 0.0, 1.0); // Clamp vUv.y to the range [0, 1]
                
                vec3 color;
                if (t < 0.2) {
                  // color = oxf2aeb1;
                } else if (t < 0.4) {
                  // Yellow to Orange
                  color = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.5, 0.0), (t - 0.2) * 5.0);
                } else if (t < 0.6) {
                  // Orange to Red
                  color = mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 0.0, 0.0), (t - 0.4) * 5.0);
                } else if (t < 0.8) {
                  // Red to Dark Red
                  color = mix(vec3(1.0, 0.0, 0.0), vec3(0.5, 0.0, 0.0), (t - 0.6) * 5.0);
                } else if (t < 0.9) {
                  // Green to Yellow
                  color = mix(vec3(0.0, 0.5, 0.0), vec3(1.0, 1.0, 0.0), t * 5.0);
                } else {
                  // Dark Red
                  color = vec3(0.5, 0.0, 0.0);
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });
  };

  const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue material
  const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red material

  brain.scene.traverse((child) => {
    if (child.isMesh) {
      switch (child.name) {
        case "Brain_Part_02":
          child.material.color = new THREE.Color(0x3f0a0c);
          break;
        case "Brain_Part_04":
          child.material.color = new THREE.Color(0xffffff);
          break;
        case "Brain_Part_05":
          child.material.color = new THREE.Color(0xffffb1);
          break;
        case "Brain_Part_06":
          child.material.color = new THREE.Color(0xf2aeb1);
          child.material = createCustomMaterial(texture);     
          break;
      }
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <mesh>
      <directionalLight intensity={1} position={[0, 1, 0]} castShadow />
      <directionalLight intensity={1} position={[0, -1, 0]} castShadow />
      <directionalLight intensity={1} position={[1, 0, 0]} />
      <directionalLight intensity={1} position={[-1, 0, 0]} />
      <directionalLight intensity={1} position={[0, 0, 1]} />
      <directionalLight intensity={1} position={[0, 0, -1]} />

      {/* <directionalLight position={[1, 1, 1]} />
      <directionalLight position={[-1, -1, -1]} /> */}

      <primitive object={brain.scene} scale={15} position={[1, -3, 0]} />
    </mesh>
  );
};

const Brain = () => {
  return (
    <div className="brain-canvas">
      <Typography variant="h2">Brain Visualizer</Typography>
      <Canvas
        frameloop="demand"
        shadows
        camera={{ position: [10, 10, 10], fov: 30 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<Loader />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={1}
          />
          <BrainModel />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default Brain;