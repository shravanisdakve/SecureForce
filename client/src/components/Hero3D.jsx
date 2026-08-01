import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, ContactShadows } from '@react-three/drei'

function ShieldCore() {
  const group = useRef(null)

  useFrame(({ pointer }) => {
    const g = group.current
    if (!g) return
    g.rotation.y += 0.004
    g.rotation.x += (pointer.y * 0.3 - g.rotation.x) * 0.05
    g.rotation.z += (pointer.x * 0.3 - g.rotation.z) * 0.05
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <MeshDistortMaterial color="#facc15" roughness={0.2} metalness={0.85} distort={0.35} speed={1.6} />
      </mesh>
      <mesh scale={1.6}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#facc15" wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  )
}

export default function Hero3D() {
  return (
    <div className="relative h-[380px] w-full sm:h-[440px] xl:h-[500px]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 42 }}
        style={{ background: 'transparent' }}
        aria-label="Animated 3D security crystal"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff7d6" />
        <pointLight position={[-4, -2, 3]} intensity={1.4} color="#facc15" />
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.1}>
          <ShieldCore />
        </Float>
        <Sparkles count={70} scale={7} size={2.2} speed={0.4} opacity={0.5} color="#facc15" />
        <ContactShadows position={[0, -2.3, 0]} opacity={0.4} scale={9} blur={2.6} far={4.2} color="#000000" />
      </Canvas>
    </div>
  )
}
