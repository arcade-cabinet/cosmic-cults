/**
 * BabylonCanvas - Main game canvas component using Reactylon
 *
 * Provides the BabylonJS scene container with isometric camera setup
 */

import type { ArcRotateCamera, Scene as BabylonScene } from '@babylonjs/core';
import {
  Color4,
  Engine,
  HemisphericLight,
  Scene,
  Vector3,
} from '@babylonjs/core';
import React, { type FC, useCallback, useEffect, useRef } from 'react';
import { createIsometricCamera } from '../camera';

export interface BabylonCanvasProps {
  /** Called when scene is ready */
  onSceneReady?: (scene: BabylonScene, camera: ArcRotateCamera) => void;
  /** Called on each frame render */
  onRender?: (scene: BabylonScene, deltaTime: number) => void;
  /** Canvas style */
  style?: React.CSSProperties;
  /** Canvas className */
  className?: string;
  /** Background color */
  backgroundColor?: string;
  /** Enable antialiasing */
  antialias?: boolean;
  /** Enable hardware scaling */
  adaptToDeviceRatio?: boolean;
}

/**
 * BabylonJS canvas with Reactylon integration
 */
export const BabylonCanvas: FC<BabylonCanvasProps> = ({
  onSceneReady,
  onRender,
  style,
  className,
  backgroundColor = '#0a0a12',
  antialias = true,
  adaptToDeviceRatio = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<BabylonScene | null>(null);

  // Initialize engine and scene
  const initEngine = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create engine
    const engine = new Engine(
      canvas,
      antialias,
      {
        preserveDrawingBuffer: true,
        stencil: true,
        powerPreference: 'high-performance',
      },
      adaptToDeviceRatio,
    );

    engineRef.current = engine;

    // Create scene
    const scene = new Scene(engine);
    sceneRef.current = scene;

    // Set background color
    const color = Color4.FromHexString(`${backgroundColor}ff`);
    scene.clearColor = color;

    // Create isometric camera
    const camera = createIsometricCamera(scene, canvas);

    // Add ambient light
    const light = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    light.groundColor = new Color4(
      0.2,
      0.2,
      0.3,
      1,
    ) as unknown as import('@babylonjs/core').Color3;

    // Notify scene ready
    if (onSceneReady) {
      onSceneReady(scene, camera);
    }

    // Render loop
    let lastTime = performance.now();
    engine.runRenderLoop(() => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (onRender) {
        onRender(scene, deltaTime);
      }

      scene.render();
    });

    // Handle resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [onSceneReady, onRender, backgroundColor, antialias, adaptToDeviceRatio]);

  // Initialize on mount
  useEffect(() => {
    const cleanup = initEngine();
    return cleanup;
  }, [initEngine]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        outline: 'none',
        touchAction: 'none', // Prevent browser touch gestures
        ...style,
      }}
      className={className}
    />
  );
};

export default BabylonCanvas;
