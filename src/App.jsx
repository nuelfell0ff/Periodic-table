import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { TrackballControls, Html } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three'; 
import { elementsData } from './elementsData';
import { getLayoutPositions } from './layouts';
import './App.css';

function ElementCard({ data, layout }) {
  const getColor = (type) => {
    switch (type) {
      case 'green': return { border: 'rgba(0, 255, 100, 0.8)', bg: 'rgba(0, 40, 15, 0.45)', glow: '0 0 12px rgba(0, 255, 100, 0.5)' };
      case 'yellow': return { border: 'rgba(210, 255, 40, 0.8)', bg: 'rgba(35, 40, 10, 0.45)', glow: '0 0 12px rgba(210, 255, 40, 0.5)' };
      case 'red': return { border: 'rgba(255, 40, 40, 0.8)', bg: 'rgba(45, 10, 10, 0.45)', glow: '0 0 12px rgba(255, 40, 40, 0.5)' };
      case 'cyan': return { border: 'rgba(0, 230, 255, 0.8)', bg: 'rgba(0, 35, 45, 0.45)', glow: '0 0 12px rgba(0, 230, 255, 0.5)' };
      default: return { border: 'rgba(255, 255, 255, 0.6)', bg: 'rgba(25, 25, 25, 0.45)', glow: '0 0 12px rgba(255, 255, 255, 0.3)' };
    }
  };

  const theme = getColor(data.type);

  const props = useSpring({
    to: {
      position: [layout.x, layout.y, layout.z],
      rotation: [layout.rx, layout.ry, layout.rz],
    },
    config: { mass: 1.4, tension: 140, friction: 24 }
  });

  return (
    <a.group position={props.position} rotation={props.rotation}>
      <Html distanceFactor={1100} transform occlude="blending">
        <div 
          className="element-card"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.bg,
            boxShadow: theme.glow,
            textShadow: theme.glow
          }}
        >
          <div className="element-number">{data.number}</div>
          <div className="element-symbol">{data.symbol}</div>
          <div className="element-name">{data.name}</div>
        </div>
      </Html>
    </a.group>
  );
}

export default function App() {
  const [currentMode, setCurrentMode] = useState('table');
  const layouts = useMemo(() => getLayoutPositions(elementsData), []);

  return (
    <div className="app-container">
      {/* Absolute HUD Control Overlay */}
      <div className="hud-menu">
        {['table', 'sphere', 'helix', 'grid'].map((mode) => (
          <button 
            key={mode} 
            className={currentMode === mode ? 'active' : ''} 
            onClick={() => setCurrentMode(mode)}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Balanced 3D Viewport Engine */}
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 1100], fov: 45 }}>
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={1.8} />
          
          {/* Pushed back along Z axis to create physical separation from headers */}
          <group position={[0, 0, -150]}>
            {elementsData.map((el, index) => (
              <ElementCard 
                key={el.number} 
                data={el} 
                layout={layouts[currentMode][index]} 
              />
            ))}
          </group>

          <TrackballControls rotateSpeed={2.2} zoomSpeed={1.2} panSpeed={0.8} />
        </Canvas>
      </div>
    </div>
  );
}