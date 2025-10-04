import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface TextElement {
  id: string;
  text: string;
  position: [number, number, number];
  color: string;
  size: number;
}

interface LogoElement {
  id: string;
  url: string;
  position: [number, number, number];
  scale: number;
}

interface ThreeEditorProps {
  productType: string;
  baseColor: string;
  textElements: TextElement[];
  logoElements: LogoElement[];
}

// Product meshes for different items
const ProductMesh = ({ productType, baseColor }: { productType: string; baseColor: string }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const getGeometry = () => {
    switch (productType) {
      case 'jersey':
      case 'hoodie':
      case 'tshirt':
        // T-shirt/jersey shape
        return (
          <group ref={groupRef}>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 2.5, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            {/* Sleeves */}
            <mesh position={[-1.2, 0.6, 0]}>
              <boxGeometry args={[0.6, 1.5, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[1.2, 0.6, 0]}>
              <boxGeometry args={[0.6, 1.5, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            {/* Collar */}
            <mesh position={[0, 1.3, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        );
      case 'cap':
        return (
          <group ref={groupRef}>
            <mesh>
              <cylinderGeometry args={[1.2, 1, 0.5, 32]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        );
      case 'mousepad':
        return (
          <group ref={groupRef}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.1, 64]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        );
      case 'arm-sleeves':
      case 'finger-sleeves':
        return (
          <group ref={groupRef}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.3, 2, 32]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        );
      case 'trousers':
        return (
          <group ref={groupRef}>
            {/* Left leg */}
            <mesh position={[-0.4, -0.5, 0]}>
              <boxGeometry args={[0.6, 2.5, 0.4]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            {/* Right leg */}
            <mesh position={[0.4, -0.5, 0]}>
              <boxGeometry args={[0.6, 2.5, 0.4]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            {/* Waist */}
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[1.4, 0.4, 0.4]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        );
      default:
        return (
          <group ref={groupRef}>
            <mesh>
              <boxGeometry args={[2, 2, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        );
    }
  };

  return <>{getGeometry()}</>;
};

// Text overlay component
const TextOverlay = ({ element }: { element: TextElement }) => {
  return (
    <Center position={element.position}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={element.size}
        height={0.05}
      >
        {element.text}
        <meshStandardMaterial color={element.color} />
      </Text3D>
    </Center>
  );
};

// Logo overlay component
const LogoOverlay = ({ element }: { element: LogoElement }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useState(() => {
    if (element.url) {
      new THREE.TextureLoader().load(element.url, (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  });

  if (!texture) return null;

  return (
    <mesh position={element.position}>
      <planeGeometry args={[element.scale, element.scale]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

export const ThreeEditor = ({
  productType,
  baseColor,
  textElements,
  logoElements,
}: ThreeEditorProps) => {
  return (
    <Canvas style={{ height: '600px', width: '100%' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom enablePan enableRotate />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />

      {/* Product */}
      <ProductMesh productType={productType} baseColor={baseColor} />

      {/* Text elements */}
      {textElements.map((element) => (
        <TextOverlay key={element.id} element={element} />
      ))}

      {/* Logo elements */}
      {logoElements.map((element) => (
        <LogoOverlay key={element.id} element={element} />
      ))}

      {/* Grid helper */}
      <gridHelper args={[10, 10]} />
    </Canvas>
  );
};
