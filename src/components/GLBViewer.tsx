import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface GLBViewerProps {
  modelPath: string;
  backgroundColor?: string;
  className?: string;
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

const GLBViewer: React.FC<GLBViewerProps> = ({ 
  modelPath, 
  backgroundColor = '#dddddd',
  className = '',
  onError,
  onSuccess
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Get card size
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ff8b00');
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      55,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = false;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(10, 10, 10);
    dirLight1.castShadow = false;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 20;
    controlsRef.current = controls;

    // Load GLB model
    const loader = new GLTFLoader();
    
    // Add error handling for invalid file types
    const checkFileType = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('model/gltf-binary') && !contentType.includes('application/octet-stream')) {
          console.warn('File might not be a valid GLB file. Content-Type:', contentType);
        }
      } catch (err) {
        console.warn('Could not check file type:', err);
      }
    };
    
    checkFileType(modelPath);
    
    loader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);
        console.log("Model loaded successfully");
        onSuccess?.();

        // --- Disable shadow casting for model ---
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).castShadow = false;
          }
        });

        // --- Auto-fit model in view ---
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // --- Remove shadow-receiving plane ---
        // Shadow receiver removed to eliminate shadows

        // Adjust lighting intensity for better visibility without shadows
        dirLight1.intensity = 1.5;

        // --- Use bounding sphere for perfect framing ---
        const boundingSphere = box.getBoundingSphere(new THREE.Sphere());
        const radius = boundingSphere.radius;
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(radius / Math.sin(fov / 2));
        cameraZ *= 1.1; // Small padding

        camera.position.set(center.x, center.y, cameraZ + center.z);
        camera.near = 0.1;
        camera.far = cameraZ * 4;
        camera.updateProjectionMatrix();
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading model:", error);
        console.error("This usually means the GLB file is corrupted or invalid.");
        console.error("Try using a different GLB file or check if the file was properly exported.");
        onError?.(error);
      }
    );

    // Handle resize for the card size
    const handleResize = () => {
      if (!camera || !renderer || !mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (controls) controls.update();
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (mountRef.current && renderer?.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      if (renderer) {
        renderer.dispose();
      }

      if (controls) {
        controls.dispose();
      }
    };
  }, [modelPath, backgroundColor]);

  return (
    <div 
      ref={mountRef} 
      className={className}
      style={{ 
        width: '100%', 
        height: '100%',
        margin: 0,
        overflow: 'hidden'
      }}
    />
  );
};

export default GLBViewer; 