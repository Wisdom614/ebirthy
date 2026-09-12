'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { audio } from '../../utils/audioManager';

interface Vault3DCoreProps {
  themeColor?: string;
  onInteract?: (msg: string) => void;
  isUnlocked?: boolean;
}

const SECURITY_HINTS = [
  '🔒 VAULT SHIELD INTEGRITY: 100% · ENCRYPTED UNTIL ZERO-HOUR',
  '✦ DISPATCH CONTENTS: CLASSIFIED MILESTONES & HEARTFELT LETTER',
  '⚡ SECURITY SCAN: BIOMETRIC RECEPTOR SYNCHRONIZED',
  '★ ORIGIN: CRAFTED WITH CARE BY YOUR CREATOR',
  '⏱️ PROTOCOL: VAULT AUTOMATICALLY UNSEALS ON SCHEDULE',
  '✨ QUANTUM LOCK: READY FOR ZERO-SECOND DETONATION OF CONFETTI'
];

export const Vault3DCore: React.FC<Vault3DCoreProps> = ({
  themeColor = '#f59e0b',
  onInteract
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(new THREE.Color(themeColor), 3, 50);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 2, 50);
    pointLight2.position.set(-4, -4, 4);
    scene.add(pointLight2);

    // 4. Main Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 5. Outer Crystal Dodecahedron (The Vault Core)
    const vaultGeo = new THREE.DodecahedronGeometry(1.2, 0);
    const vaultMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.82
    });
    const vaultMesh = new THREE.Mesh(vaultGeo, vaultMat);
    rootGroup.add(vaultMesh);

    // Outer Wireframe Cage
    const wireGeo = new THREE.WireframeGeometry(vaultGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
      transparent: true,
      opacity: 0.7
    });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    vaultMesh.add(wireLines);

    // 6. Inner Glowing Gem (The Heart Core)
    const innerGeo = new THREE.OctahedronGeometry(0.55, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(themeColor),
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerMesh);

    // 7. Kinetic Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(1.7, 0.025, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.95, 0.02, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    rootGroup.add(ring2);

    // 8. Surrounding Sparkle Particle Swarm
    const particlesCount = 45;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      starPositions[i] = radius * Math.cos(theta) * Math.cos(phi);
      starPositions[i + 1] = radius * Math.sin(phi);
      starPositions[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.9
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
        targetRotY = x * 0.6;
        targetRotX = -y * 0.6;
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

      rootGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 0.6) * 0.08;
      rootGroup.rotation.y = currentRotY + elapsedTime * 0.45;

      // Rotate sub-elements
      vaultMesh.rotation.y = elapsedTime * 0.3;
      vaultMesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;

      innerMesh.rotation.x = -elapsedTime * 0.6;
      innerMesh.rotation.y = elapsedTime * 0.8;

      ring1.rotation.x = elapsedTime * 0.5;
      ring1.rotation.y = elapsedTime * 0.7;

      ring2.rotation.y = -elapsedTime * 0.4;
      ring2.rotation.z = elapsedTime * 0.3;

      starPoints.rotation.y = elapsedTime * 0.15;

      // Floating bobbing motion
      rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
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

    const nextIdx = (hintIndex + 1) % SECURITY_HINTS.length;
    setHintIndex(nextIdx);
    if (onInteract) {
      onInteract(SECURITY_HINTS[nextIdx]);
    }
  };

  return (
    <div className="flex flex-col items-center select-none relative">
      {/* 3D Canvas Container with Click Haptic */}
      <div
        ref={containerRef}
        onClick={handleVaultClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] relative cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        title="Tap the 3D Vault Core to scan security integrity"
      >
        {/* Shockwave Energy Pulse on Click */}
        {shockwaveActive && (
          <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping pointer-events-none" />
        )}

        {/* Ambient Ring Indicator */}
        <div className="absolute inset-4 rounded-full border border-dashed border-amber-400/30 animate-spin-slow pointer-events-none" />
      </div>

      {/* Interactive Scan Prompt Pill */}
      <button
        onClick={handleVaultClick}
        className="mt-1 px-3 py-1 bg-white/80 hover:bg-white text-[#1c1917] border-2 border-[#1c1917] font-mono text-[9px] sm:text-[10px] font-black uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span>[ TAP VAULT TO TEST SHIELD ]</span>
      </button>

      {/* Live Security Readout Output */}
      <div className="mt-3 px-3 py-1.5 bg-[#f7f4ed] border border-[#1c1917]/30 max-w-sm w-full text-center shadow-xs">
        <p className="font-mono text-[9px] sm:text-[10px] text-amber-900 font-bold uppercase tracking-wider line-clamp-2">
          &gt;&gt; {SECURITY_HINTS[hintIndex]}
        </p>
      </div>
    </div>
  );
};
