import { Canvas, useFrame } from "@react-three/fiber/native";
import { useGLTF } from "@react-three/drei/native";
import React, { useRef, useState, Suspense, createContext } from "react";
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Text  as Text3D } from 'troika-three-text';
import { StatusBar } from "react-native";
import moon_model from "./assets/map_models/NASA_moon.glb";
import red_box from "./assets/map_models/Box.glb";
import world from "./assets/map_models/World.glb";
import { OrbitControls } from "@react-three/drei/native";


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log("Error: ", error, " info: ", info, " ======================");
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <LoadingError/>;
    }
    return this.props.children;
  }
}


function Model({url}, props) {
  console.log("loading ", url.url)
  const modelRef = useRef();
  const gltf = useGLTF(url);
  console.log("loaded..")

  useFrame((state, delta) => (gltf.scene.rotation.y += delta/6))

  return( <primitive 
    object={gltf.scene}
    scale={0.05}
    rotation={[0.4, 0, 0]}
    /> );
}


function LoadModel({url}, props) {
  console.log("loading ", url)

  const modelRef = useRef();
  const gltf = useGLTF(url);
  
  console.log("loaded")

  const [hovered, hover] = useState(false)
  
  useFrame((state, delta) => (modelRef.current.rotation.y += delta))
  return (
    <mesh
      {...props}
      mesh={gltf.scene.mesh}
      ref={modelRef}
      position={[0, 0, 0]}
      scale={0.5}
      rotation={[0, 0, 0]}
      onPointerOver={(event) => (event.stopPropagation(), hover(true), console.log("im on"))}
      onPointerOut={(event) => hover(false)}>
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      {/*<primitive object={gltf.scene.clone()}/>*/}
    </mesh>
  )
}


function Box(props) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => (ref.current.rotation.y += delta))
  return (
    <mesh
      {...props}
      ref={ref}
      position={[0,2,-4]}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


function TopBar() {
  return (
    <View style={styles.top_bar}>
      <Text style={styles.title_text}>Map viewer</Text>
    </View>
  )
}


function OptionBar() {
  return (
    <View style={styles.option_bar}>
      <Text style={styles.title_text}>Options</Text>
    </View>
  )
}


function MapCanvas() {
  return(
    <Canvas style={{flex:1, backgroundColor:"#e6b5a1"}}>
      <color attach="background" args={["#faded2"]} />
      <ambientLight intensity={Math.PI/3} />
      <spotLight position={[10, 10, 10]} angle={0.20} penumbra={1} decay={0} intensity={Math.PI*30} />
      
      <ErrorBoundary>
        <Model url={"https://homologmodels.blob.core.windows.net/models/5d8dc969-b06e-44a0-814f-e0a669fa5292"} />
        <OrbitControls/>
      </ErrorBoundary>

    </Canvas>
  )
}


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar/>
      <OptionBar/>
      <Suspense fallback={<Box/>}>
        <MapCanvas/>
      </Suspense>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2db9b',
  },
  top_bar: {
    flex: 0.1,
    backgroundColor: '#1f1b21',
    alignItems:'center',
    justifyContent: 'center'
  },
  option_bar: {
    flex: 0.06,
    backgroundColor: '#211c0d',
    alignItems:'center',
    justifyContent: 'center'
  },
  map_view_area: {
    flex: 0.3,
    position: 'absolute',
    backgroundColor: '#000000',
    margin: '5px',
    top: '50%',
    marginColor: '#000000',
  },
  map: {
    flex: 0.84,
    zIndex:10
  },
  title_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loading_text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    top:'80%',
  },
  loading_text_canvas: {
    position:"absolute", 
    fontSize: 15,
    fontWeight: "bold",
    top:'80%', 
    left:'20%', 
    color:'#000',
    zIndex:11
  }
});
