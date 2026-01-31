'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
    const { progress, active } = useProgress();
    return (
        <Html center>
            <div style={{
                color: '#008751',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.8)',
                padding: '20px',
                borderRadius: '10px',
                minWidth: '150px'
            }}>
                {active ? `Loading... ${progress.toFixed(0)}%` : 'Initializing...'}
            </div>
        </Html>
    );
}

function Robot() {
    const { scene } = useGLTF('/models/kuma_heavy_robot_r-9000s.glb');
    const meshRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={0.0009}
            position={[0, -0.3, 0]}
            rotation={[0.2, -0.5, 0]}
        />
    );
}

export default function RobotModel() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="robot-model-loading">
                Initializing 3D...
            </div>
        );
    }

    return (
        <div className="robot-model-container">
            <Canvas
                camera={{ position: [2.5, 1, 2], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-5, 5, -5]} intensity={1} />
                <directionalLight position={[0, -5, 0]} intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />

                <Suspense fallback={<Loader />}>
                    <Robot />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                />
            </Canvas>
        </div>
    );
}
