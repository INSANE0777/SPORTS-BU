import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// Configuration updated for dark particles on a light background
const config = {
    particles: { count: 35000, size: 0.4, boxSize: 6 }, // Slightly larger particles
    simulation: { noiseSpeed: 0.02, noiseScale: 1.0, mouseRepulsion: 0.008, friction: 0.96 },
    camera: { initialDistance: 5, parallaxIntensity: 0.005 }
};

export const GenerativeArtScene = () => {
    const mountRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(1000, 1000));

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- Core Three.js Setup (No Post-Processing) ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = config.camera.initialDistance;

        // Renderer with transparent background
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // --- Particle System with DARK Colors ---
        const particleCount = config.particles.count;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3).fill(0);
        
        // Define our dark color palette from your theme
        const darkColors = [
            new THREE.Color("#282828"), // ink
            new THREE.Color("#193497")  // cobalt
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 1] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 2] = (Math.random() - 0.5) * config.particles.boxSize;

            // Pick a random dark color
            const chosenColor = darkColors[Math.floor(Math.random() * darkColors.length)];
            colors[i3] = chosenColor.r;
            colors[i3 + 1] = chosenColor.g;
            colors[i3 + 2] = chosenColor.b;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // --- Material UPDATED for light background ---
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: { u_pointSize: { value: config.particles.size * renderer.getPixelRatio() } },
            vertexShader: `
                attribute vec3 color;
                varying vec3 vColor;
                uniform float u_pointSize;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = u_pointSize * (10.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float strength = 1.0 - step(0.5, distance(gl_PointCoord, vec2(0.5)));
                    if (strength < 0.1) discard; // Slightly crisper edges
                    gl_FragColor = vec4(vColor, strength);
                }
            `,
            transparent: true,
            blending: THREE.NormalBlending, // CRITICAL CHANGE: Use NormalBlending for dark particles
            depthWrite: false,
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // --- Animation Loop ---
        const curlNoiseFn = (p, time, scale) => new THREE.Vector3(Math.sin(p.y * scale + time), Math.cos(p.z * scale + time), Math.sin(p.x * scale + time)).normalize();
        let frameId;
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            const positions = particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const p = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                const curlForce = curlNoiseFn(p, elapsedTime * config.simulation.noiseSpeed, config.simulation.noiseScale);
                const mouseForce = new THREE.Vector3();
                const mouseTarget = new THREE.Vector3(mouseRef.current.x * (config.particles.boxSize / 2), mouseRef.current.y * (config.particles.boxSize / 2), 0);
                const distanceToMouse = p.distanceTo(mouseTarget);
                if (distanceToMouse < 2) {
                    mouseForce.subVectors(p, mouseTarget).normalize().multiplyScalar(1 / (distanceToMouse + 0.1));
                }
                velocities[i3] += (curlForce.x * 0.001 + mouseForce.x * config.simulation.mouseRepulsion);
                velocities[i3 + 1] += (curlForce.y * 0.001 + mouseForce.y * config.simulation.mouseRepulsion);
                velocities[i3 + 2] += (curlForce.z * 0.001 + mouseForce.z * config.simulation.mouseRepulsion);
                velocities[i3] *= config.simulation.friction;
                velocities[i3 + 1] *= config.simulation.friction;
                velocities[i3 + 2] *= config.simulation.friction;
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            camera.position.x += (mouseRef.current.x * config.camera.parallaxIntensity - camera.position.x) * 0.02;
            camera.position.y += (-mouseRef.current.y * config.camera.parallaxIntensity - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera); // CRITICAL CHANGE: Direct render, no composer
            frameId = requestAnimationFrame(animate);
        };
        animate();

        // --- Event Handlers & Cleanup ---
        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            currentMount.removeChild(renderer.domElement);
            particleGeometry.dispose();
            particleMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}