import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text3D, Center } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { DesignElement } from "@/pages/CustomDesign";

interface ThreeEditorProps {
  productType: string;
  elements: DesignElement[];
}

const ProductModel = ({ type }: { type: string }) => {
  const groupRef = useRef<THREE.Group>(null);

  const getProductGeometry = () => {
    switch (type) {
      case "jersey":
        return (
          <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 2.5, 0.2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-1.2, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[1.2, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      case "hoodie":
        return (
          <group ref={groupRef}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[2, 2.5, 0.2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.5, 0.6, 0.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-1.2, 0.8, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[1.2, 0.8, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      case "trousers":
        return (
          <group ref={groupRef}>
            <mesh position={[-0.4, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 2.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 2.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[1.5, 0.4, 0.2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      case "mousepad":
        return (
          <group ref={groupRef}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[3, 2.5, 0.1]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      case "cap":
        return (
          <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 8, 0, 0]}>
              <boxGeometry args={[1.2, 0.05, 0.8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      case "t-shirt":
        return (
          <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 2, 0.2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-1.2, 0.3, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[1.2, 0.3, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      case "arm-sleeves":
        return (
          <group ref={groupRef}>
            <mesh position={[-0.5, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 1.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 1.5, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      case "finger-sleeves":
        return (
          <group ref={groupRef}>
            <mesh position={[-0.3, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 0.6, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 0.6, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      default:
        return (
          <group ref={groupRef}>
            <mesh>
              <boxGeometry args={[2, 2.5, 0.2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
    }
  };

  return getProductGeometry();
};

const DesignElements = ({ elements }: { elements: DesignElement[] }) => {
  return (
    <>
      {elements.map((element) => {
        if (element.type === "text") {
          return (
            <Center key={element.id} position={element.position}>
              <Text3D
                font="/fonts/helvetiker_regular.typeface.json"
                size={element.size || 0.3}
                height={0.05}
              >
                {element.content}
                <meshStandardMaterial color={element.color || "#000000"} />
              </Text3D>
            </Center>
          );
        } else if (element.type === "logo") {
          return (
            <mesh key={element.id} position={element.position}>
              <planeGeometry args={[element.scale || 0.5, element.scale || 0.5]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
          );
        }
        return null;
      })}
    </>
  );
};

export const ThreeEditor = ({ productType, elements }: ThreeEditorProps) => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enablePan enableZoom enableRotate />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <ProductModel type={productType} />
      <DesignElements elements={elements} />
      
      <gridHelper args={[10, 10]} />
    </Canvas>
  );
};
