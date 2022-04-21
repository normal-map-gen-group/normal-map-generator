import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import texture from "../../np.png"

export default function Box(props){

const normalMap = useLoader(TextureLoader, props.normalMap);

  return (
    <mesh rotation={[90, 0, 20]}>
      <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
      <meshNormalMaterial attach="material" />
      <meshStandardMaterial normalMap={normalMap} color="black" roughness="0.3" />
    </mesh>
  );
}