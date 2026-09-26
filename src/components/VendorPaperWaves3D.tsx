"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VendorPaperWaves3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(3.2, 1.6, 6.8);
    camera.lookAt(0.2, 0.1, 0);

    // 2. High-Fidelity Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Studio Diffuse Lighting for Physical Paper Feel
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Key light creating soft highlights on curved paper edges
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 9, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Soft cool fill light from below/side for ambient occlusion depth
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.2);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // Rim light along the cascading paper folds
    const rimLight = new THREE.DirectionalLight(0xf1f5f9, 1.4);
    rimLight.position.set(1, 10, -2);
    scene.add(rimLight);

    // 4. Create Layered Cascading Curled Paper Sheets
    const paperGroup = new THREE.Group();
    scene.add(paperGroup);

    // Physical Matte Paper Material
    const paperMaterialFront = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.44,
      metalness: 0.0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
      flatShading: false,
    });

    const paperMaterialShadowed = new THREE.MeshPhysicalMaterial({
      color: 0xf4f6f8,
      roughness: 0.5,
      metalness: 0.0,
      clearcoat: 0.04,
      side: THREE.DoubleSide,
      flatShading: false,
    });

    const sheetCount = 5;
    const sheets: {
      mesh: THREE.Mesh;
      baseRotation: THREE.Euler;
      originalPositions: Float32Array;
      speed: number;
      offset: number;
    }[] = [];

    for (let i = 0; i < sheetCount; i++) {
      // Create segmented curved sheet geometry
      const segW = 64;
      const segH = 64;
      const planeGeo = new THREE.PlaneGeometry(4.2, 5.0, segW, segH);
      const posAttr = planeGeo.attributes.position;
      const origPos = new Float32Array(posAttr.array.length);

      // Deform flat plane into an organic flowing curled paper wave
      const layerOffset = i * 0.28;
      const curlIntensity = 1.05 + i * 0.12;

      for (let j = 0; j < posAttr.count; j++) {
        const u = (posAttr.getX(j) / 4.2) + 0.5; // 0 to 1
        const v = (posAttr.getY(j) / 5.0) + 0.5; // 0 to 1

        // Compound paper curve: sweep + curl from top-right to bottom-left
        const sweepCurve = Math.sin(u * Math.PI * 1.1) * 0.85;
        const rollCurl = Math.pow(u, 1.8) * Math.sin(v * Math.PI * 0.95) * curlIntensity;
        const waveZ = Math.sin(v * Math.PI * 1.4 + u * 1.2) * 0.4;

        const newZ = sweepCurve + rollCurl + waveZ + layerOffset;
        const newX = posAttr.getX(j) - Math.pow(1 - v, 2) * 0.4;
        const newY = posAttr.getY(j) + Math.sin(u * Math.PI * 0.8) * 0.3;

        posAttr.setXYZ(j, newX, newY, newZ);
        origPos[j * 3] = newX;
        origPos[j * 3 + 1] = newY;
        origPos[j * 3 + 2] = newZ;
      }

      planeGeo.computeVertexNormals();

      // Alternate materials for realistic inter-sheet shading depth
      const mat = i % 2 === 0 ? paperMaterialFront : paperMaterialShadowed;
      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Position cascading gracefully from top right towards center
      mesh.position.set(0.7 + i * 0.32, -0.15 - i * 0.18, 0.4 - i * 0.42);
      mesh.rotation.set(0.35 - i * 0.04, -0.68 + i * 0.05, 0.48 - i * 0.03);

      paperGroup.add(mesh);
      sheets.push({
        mesh,
        baseRotation: mesh.rotation.clone(),
        originalPositions: origPos,
        speed: 0.8 + i * 0.15,
        offset: i * 0.6,
      });
    }

    // Gentle global orientation matching reference layout
    paperGroup.position.set(0.6, 0.1, 0);

    // 5. Interactive Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotX = y * 0.14;
      targetRotY = x * 0.22;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 6. Animation Loop (Smooth Organic Paper Wave & Parallax)
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera/group tilt towards mouse
      paperGroup.rotation.x += (targetRotX - paperGroup.rotation.x) * 0.04;
      paperGroup.rotation.y += (targetRotY - paperGroup.rotation.y) * 0.04;

      // Subtle procedural breathing oscillation for each sheet
      for (let s = 0; s < sheets.length; s++) {
        const item = sheets[s];
        const posAttr = item.mesh.geometry.attributes.position;
        const orig = item.originalPositions;
        const time = elapsedTime * item.speed + item.offset;

        for (let j = 0; j < posAttr.count; j++) {
          const idx = j * 3;
          const origX = orig[idx];
          const origY = orig[idx + 1];
          const origZ = orig[idx + 2];

          // Micro-ripple wave along the trailing edge of the paper
          const ripple = Math.sin(time + origX * 1.5 + origY * 1.2) * 0.035;
          posAttr.setZ(j, origZ + ripple);
        }

        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 8. Cleanup on Unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      sheets.forEach((s) => {
        s.mesh.geometry.dispose();
      });
      paperMaterialFront.dispose();
      paperMaterialShadowed.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 520,
        position: "relative",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
      aria-label="Interactive 3D WebGL Paper Sculpture"
    />
  );
}
