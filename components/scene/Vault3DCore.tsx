'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { audio } from '../../utils/audioManager';

interface Vault3DCoreProps {
  themeColor?: string;
  onInteract?: (msg: string) => void;
}

export const Vault3DCore: React.FC<Vault3DCoreProps> = ({
  themeColor = '#f59e0b',
  onInteract
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shockwaveActive, setShockwaveActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.0;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting - Warm Natural Candlelight & Soft Rim Light
    const ambientLight = new THREE.AmbientLight(0xf5ebe1, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xd4af37, 2.8, 30);
    pointLight1.position.set(4, 5, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa37e36, 2.0, 30);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    const rimLight = new THREE.PointLight(0xfaf5ee, 1.6, 30);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 4. Main Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 5. Outer Crystal Dodecahedron (The Vault Shell) - Antique Champagne Bronze
    const vaultGeo = new THREE.DodecahedronGeometry(1.25, 0);
    const vaultMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xb38a42),
      metalness: 0.86,
      roughness: 0.28,
      transparent: true,
      opacity: 0.88,
      wireframe: false
    });
    const vaultMesh = new THREE.Mesh(vaultGeo, vaultMat);
    rootGroup.add(vaultMesh);

    // Outer Wireframe Cage for precision look - Soft Muted Champagne
    const wireGeo = new THREE.WireframeGeometry(vaultGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xe6d5b8,
      linewidth: 1.2,
      transparent: true,
      opacity: 0.65
    });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    vaultMesh.add(wireLines);

    // 6. Inner Glowing Core - Soft Candle Amber
    const innerGeo = new THREE.OctahedronGeometry(0.58, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xfaf5ee,
      emissive: new THREE.Color(0xc5a059),
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.15
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerMesh);

    // 7. Kinetic Orbital Rings - Brushed Champagne Brass
    const ring1Geo = new THREE.TorusGeometry(1.75, 0.022, 16, 80);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xc5a059),
      metalness: 0.9,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.0, 0.018, 16, 80);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xdfd3c3,
      metalness: 0.85,
      roughness: 0.25,
      transparent: true,
      opacity: 0.65
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    rootGroup.add(ring2);

    // 8. Surrounding Sparkle Particle Swarm - Natural Stardust
    const particlesCount = 45;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 2.1 + Math.random() * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      starPositions[i] = radius * Math.cos(theta) * Math.cos(phi);
      starPositions[i + 1] = radius * Math.sin(phi);
      starPositions[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xeae0d0,
      size: 0.045,
      transparent: true,
      opacity: 0.75
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    rootGroup.add(starPoints);

    // Interaction & Mouse tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotY += deltaX * 0.01;
        targetRotX += deltaY * 0.01;
        prevMouseX = clientX;
        prevMouseY = clientY;
      } else {
        targetRotY = x * 0.5;
        targetRotX = -y * 0.5;
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchmove', onPointerMove);
    container.addEventListener('touchstart', onPointerDown);
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp rotation toward cursor
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      rootGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 0.6) * 0.06;
      rootGroup.rotation.y = currentRotY + elapsedTime * 0.4;

      // Rotate sub-elements
      vaultMesh.rotation.y = elapsedTime * 0.25;
      vaultMesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.15;

      innerMesh.rotation.x = -elapsedTime * 0.5;
      innerMesh.rotation.y = elapsedTime * 0.7;

      ring1.rotation.x = elapsedTime * 0.45;
      ring1.rotation.y = elapsedTime * 0.65;

      ring2.rotation.y = -elapsedTime * 0.35;
      ring2.rotation.z = elapsedTime * 0.25;

      starPoints.rotation.y = elapsedTime * 0.12;

      // Floating bobbing motion
      rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [themeColor]);

  const handleVaultClick = () => {
    audio.playSFX('sparkle');
    setShockwaveActive(true);
    setTimeout(() => setShockwaveActive(false), 800);
    if (onInteract) {
      onInteract('VAULT_PULSE');
    }
  };

  return (
    <div className="flex flex-col items-center select-none relative my-2">
      {/* 3D Canvas Container with Subtle Halo & Pulse */}
      <div
        ref={containerRef}
        onClick={handleVaultClick}
        className="w-[240px] h-[240px] sm:w-[290px] sm:h-[290px] relative cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        {/* Soft Radial Backlight */}
        <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent blur-xl pointer-events-none" />

        {/* Shockwave Energy Pulse on Click */}
        {shockwaveActive && (
          <div className="absolute inset-0 rounded-full border border-amber-400/80 animate-ping pointer-events-none" />
        )}

        {/* Delicate Outer Ambient Gyro Ring */}
        <div className="absolute inset-6 rounded-full border border-amber-400/20 border-dashed animate-spin-slow pointer-events-none" />
      </div>
    </div>
  );
};

