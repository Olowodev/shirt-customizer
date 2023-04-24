import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Image, AccumulativeShadows, RandomizedLight, Decal, Environment, Center, Text, RenderTexture, PerspectiveCamera } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { state } from './store'
import * as THREE from 'three'


export const App = ({ position = [0, 0, 190], fov = 25 }) => (
  <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document.getElementById('root')} eventPrefix="client">
    <ambientLight intensity={0.5} />
    <Environment preset="city" />
    <CameraRig>
      <Backdrop />
      <Center>
        <Shirt />
      </Center>
    </CameraRig>
  </Canvas>
)

function Backdrop() {
  const shadows = useRef()
  useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))
  return (
    <AccumulativeShadows ref={shadows} temporal frames={60} alphaTest={0.85} scale={10} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.14]}>
      <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  const snap = useSnapshot(state)
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 3.4 : 0, 0, 210], 0.25, delta)
    // easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 3.4 : 10, 20, 100], 0.25, delta)
    easing.dampE(group.current.rotation, [state.pointer.y / 10, -state.pointer.x / 5, 0], 0.25, delta)
  })
  return <group ref={group}>{children}</group>
}

function Shirt(props) {
  const snap = useSnapshot(state)
  const mesh = useRef()
  const sponsor = useRef()
  const club = useRef()
  const smallSponsor = useRef()
  const [hovered, setHovered] = useState(null)
  const texture = useTexture(`/${snap.decal}.png`)
  const mainTexture = useTexture('threee.png')
  const leftTexture = useTexture('nikee.png')
  useEffect(() => {
    const cursor = `
      <svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0)">
          <path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/>
          <g filter="url(#filter0_d)">
            <path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="none"/>
          </g>
          <path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/>
          <text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em">
            <tspan x="35" y="63">${hovered}</tspan>
          </text>
        </g>
        <defs>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0h64v64H0z"/>
          </clipPath>
          <filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="3"/>
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
          </filter>
        </defs>
      </svg>
    `
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
      return () => (document.body.style.cursor = 'auto')
    }

  }, [hovered])
  const { nodes, materials } = useGLTF('/shirt.glb')
  useFrame((state, delta) => easing.dampC(materials.initialShadingGroup.color, snap.color, 0.25, delta))
  useFrame((state, delta) => {
    snap.intro ? mesh.current.rotation.z = state.clock.elapsedTime : easing.dampE(mesh.current.rotation, [1.7, 0, snap.flip ? 3 : 0], 0.25, delta)
    // snap.flip ? easing.dampE(mesh.current.rotation, [1.7, 0, 3], 0.25, delta) : easing.dampE(mesh.current.rotation, [1.7, 0, 0], 0.25, delta)
    // mesh.current.rotation.z = state.clock.elapsedTime
  })
  

  const handleHover = () => {
    console.log('me')
  }

  useEffect(() => {
    const decal = sponsor.current
    decal?.addEventListener("onpointerover", handleHover)
    // console.log(sponsor.current)
    // console.log(sponsor.current.addEventListener())
  }, [sponsor])
  return (
    <mesh ref={mesh} rotation={[1.7, 0, snap.flip ? 3 : 0]} castShadow geometry={nodes.shirt.geometry} material={materials.initialShadingGroup} material-roughness={1} {...props} dispose={null}>
      
      <Decal ref={sponsor} scale={20} position={[0, 10.15, -3]} rotation={[-1.7, 0, 0]} map-anisotropy={16}>
        {/* <meshBasicMaterial transparent polygonOffset polygonOffsetFactor={-100} toneMapped={false} >
          <SponsorTexture />
        </meshBasicMaterial> */}
        <meshBasicMaterial transparent polygonOffset polygonOffsetFactor={-100} toneMapped={false}>
          <RenderTexture attach={'map'}>
            <PerspectiveCamera makeDefault manual position={[1.5, 0, 5]} />
            <Image position={[1.2, 0, 0]} scale={[3.1, 4, 1]} onPointerOver={(e) => (console.log(e))} url='threee.png' />
          </RenderTexture>
        </meshBasicMaterial>
      </Decal>
      <Decal ref={club} scale={6} position={[9, 10.15, -18]} rotation={[-1.7, 0, 0]} map-anisotropy={16} >
        <meshStandardMaterial transparent polygonOffset polygonOffsetFactor={-100} toneMapped={false}>
          {/* <ClubTexture texture={`/${snap.decal}.png`} /> */}
          <RenderTexture attach={'map'}>
            <PerspectiveCamera makeDefault manual position={[1.5, 0, 5]}  />
            <Image position={[1.5, 0, 0]} scale={[4, 4, 1]} onPointerOver={(e) => (console.log(e))} url={`/${snap.decal}.png`} />
          </RenderTexture>
        </meshStandardMaterial>
      </Decal>
      <Decal ref={smallSponsor} scale={6} position={[-9, 10.15, -18]} rotation={[-1.7, 0, 0]} map-anisotropy={16} >
        <meshStandardMaterial transparent polygonOffset polygonOffsetFactor={-100} toneMapped={false}>
          {/* <color attach='background' args={['#000']} /> */}
          {/* <SmallSponsorTexture /> */}
          <RenderTexture attach={'map'}>
            <PerspectiveCamera makeDefault manual position={[1.5, 0, 5]}  />
            <Image position={[1.5, 0, 0]} scale={[4, 4, 1]} onPointerOver={(e) => (console.log(e))} url={`nikee.png`} />
          </RenderTexture>
        </meshStandardMaterial>
      </Decal>
      <Decal scale={[30, 30, 30]} position={[0, -10.15, -26]} rotation={[-1.7, 3, 0]} >
        {/* <Text position={[0, 10.15, 0]} rotation={[-1.7, 0, 0]} color={'#000'} scale={20}>STUFF</Text> */}
        <meshBasicMaterial transparent polygonOffset polygonOffsetFactor={-100} toneMapped={false}>
          <NameTexture />
        </meshBasicMaterial>
      </Decal>
      <Decal position={[0, -10.15, 0]} rotation={[-1.7, 3, 0]} scale={20} >
        {/* <Text position={[0, 10.15, 0]} rotation={[-1.7, 0, 0]} color={'#000'} scale={20}>STUFF</Text> */}
        <meshBasicMaterial transparent polygonOffset polygonOffsetFactor={-100} toneMapped={false}>
          <NumberTexture />
        </meshBasicMaterial>
      </Decal>
      {/* <Text color={'#000'} scale={10} position={[4, -20.04, -18]} rotation={[-1.7, 3, 0]}>STUFF</Text> */}
    </mesh>
  )
}



// function ClubTexture({texture}) {
//   return (
//     <RenderTexture attach='map' anisotropy={16}>
//       <PerspectiveCamera makeDefault manual position={[1.5, 0, 5]} />
//       <Image onPointerOver={(e)=> (console.log(e))} scale={[4, 4, 0]} position={[1.5,0,0]} url={texture} />
//     </RenderTexture>
//   )
// }

// function SmallSponsorTexture() {
//   return (
//     <RenderTexture attach='map' anisotropy={16}>
//       <PerspectiveCamera makeDefault manual position={[1.5, 0, 5]} />
//       <Image scale={[4, 4, 0]} position={[1.5, 0, 0]} url='nikee.png' />
//     </RenderTexture>
//   )
// }

// function SponsorTexture() {
//   const textRef = useRef()
//   useEffect(() => {
//     textRef.current.name = 'sponsor'
//   }, [])
//   return (
//     <RenderTexture attach="map" anisotropy={16}>
//       <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[1.5, 0, 5]} />
//       {/* <Center position={[1.9, -1, 0]}> */}
//         <Image  onPointerOver={(e) => ( console.log('over'))} ref={textRef} scale={[3.1, 4, 0]} url='threee.png' />
//         {/* <Text ref={textRef} color={'#fff'} rotation={[0, 0, 0]}>TEST</Text> */}
//       {/* </Center> */}
//     </RenderTexture>
//   )
// }

function NameTexture() {
  const textRef = useRef()
  useEffect(() => {
    textRef.current.name ='name'
  }, [])
  return (
    <RenderTexture attach="map" anisotropy={16}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[1.5, 0, 5]} />
      <Center onPointerOver={(e) => ( console.log(e))} position={[1.9, -1, 0]}>
      <Text ref={textRef} color={'#fff'} rotation={[0, 0, 0]}>OLOWO</Text>
      </Center>
    </RenderTexture>
  )
}

function NumberTexture() {
  const textRef = useRef()
  useEffect(() => {
    textRef.current.name = 'number'
  }, [])
  return (
    <RenderTexture attach="map" anisotropy={16}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[1.5, 0, 5]} />
      <Center onPointerOver={(e) => ( console.log(e))} position={[1.7, 0.7, 0]}>
      <Text ref={textRef} color={'#fff'} fontSize={3} rotation={[0, 0, 0]}>10</Text>
      </Center>
    </RenderTexture>
  )
}

useGLTF.preload('/shirt.glb')
;['/arsenal.png', '/liverpool.png', '/chelsea.png', '/leicester.png'].forEach(useTexture.preload)
