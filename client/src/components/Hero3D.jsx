import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function shieldShape() {
  const s = new THREE.Shape()
  s.moveTo(-0.85, 0.95)
  s.lineTo(0.85, 0.95)
  s.quadraticCurveTo(1.05, 0.55, 0.9, 0.1)
  s.quadraticCurveTo(0.7, -0.65, 0, -1.15)
  s.quadraticCurveTo(-0.7, -0.65, -0.9, 0.1)
  s.quadraticCurveTo(-1.05, 0.55, -0.85, 0.95)
  return s
}

function ShieldBadge() {
  const group = useRef(null)

  useFrame(({ pointer }) => {
    const g = group.current
    if (!g) return
    g.rotation.y += 0.005
    g.rotation.x += (pointer.y * 0.3 - g.rotation.x) * 0.06
    g.rotation.z += (pointer.x * 0.3 - g.rotation.z) * 0.06
  })

  return (
    <group ref={group}>
      <mesh>
        <extrudeGeometry
          args={[
            shieldShape(),
            { depth: 0.3, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.09, bevelSegments: 6, steps: 1 },
          ]}
        />
        <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function Hero3D({ className = '' }) {
  return (
    <div className={className}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5.2], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 4]} intensity={2} color="#fff7d6" />
        <pointLight position={[-3, -2, 3]} intensity={1.2} color="#facc15" />
        <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.8}>
          <ShieldBadge />
        </Float>
        <Sparkles count={40} scale={4} size={1.8} speed={0.35} opacity={0.45} color="#facc15" />
        <ContactShadows position={[0, -1.7, 0]} opacity={0.45} scale={5} blur={2.5} far={3} color="#000000" />
      </Canvas>
    </div>
  )
}
