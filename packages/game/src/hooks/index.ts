/**
 * Custom React hooks for Cosmic Cults game
 */

import type { ArcRotateCamera, PointerInfo, Scene } from '@babylonjs/core';
import { PointerEventTypes } from '@babylonjs/core';
import { worldToHex } from '@cosmic-cults/core';
import type { HexCoord, WorldPosition } from '@cosmic-cults/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { panCameraTo } from '../camera';
import { useGameStore } from '../components/GameProvider';

/**
 * Hook to handle pointer interactions with the scene
 */
export function usePointerInteraction(scene: Scene | null) {
  const selectUnits = useGameStore((state) => state.selectUnits);
  const clearSelection = useGameStore((state) => state.clearSelection);

  useEffect(() => {
    if (!scene) return;

    const handlePointer = (pointerInfo: PointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERTAP: {
          const pickResult = scene.pick(
            scene.pointerX,
            scene.pointerY,
            (mesh) => mesh.isPickable,
          );

          if (pickResult?.hit && pickResult.pickedMesh) {
            const meshId = pickResult.pickedMesh.metadata?.entityId;
            if (meshId) {
              // Select the unit
              selectUnits([meshId]);
            } else {
              // Clicked on terrain or nothing, clear selection
              clearSelection();
            }
          } else {
            clearSelection();
          }
          break;
        }
      }
    };

    const observer = scene.onPointerObservable.add(handlePointer);

    return () => {
      scene.onPointerObservable.remove(observer);
    };
  }, [scene, selectUnits, clearSelection]);
}

/**
 * Hook to handle touch gestures (pan, pinch zoom)
 */
export function useTouchGestures(camera: ArcRotateCamera | null) {
  const setZoomLevel = useGameStore((state) => state.setZoomLevel);

  useEffect(() => {
    if (!camera) return;

    // Camera inputs handle most touch gestures automatically
    // This hook can be extended for custom gesture handling

    const handleZoom = () => {
      const zoomLevel = camera.orthoTop ?? 10;
      setZoomLevel(10 / zoomLevel);
    };

    // Listen for camera changes
    camera.onAfterCheckInputsObservable.add(handleZoom);

    return () => {
      camera.onAfterCheckInputsObservable.removeCallback(handleZoom);
    };
  }, [camera, setZoomLevel]);
}

/**
 * Hook to convert screen position to hex coordinate
 */
export function useScreenToHex(scene: Scene | null) {
  return useCallback(
    (screenX: number, screenY: number): HexCoord | null => {
      if (!scene) return null;

      const pickResult = scene.pick(screenX, screenY);
      if (pickResult?.hit && pickResult.pickedPoint) {
        const worldPos: WorldPosition = {
          x: pickResult.pickedPoint.x,
          y: pickResult.pickedPoint.y,
          z: pickResult.pickedPoint.z,
        };
        return worldToHex(worldPos);
      }
      return null;
    },
    [scene],
  );
}

/**
 * Hook to manage camera panning
 */
export function useCameraPan(camera: ArcRotateCamera | null) {
  const setCameraTarget = useGameStore((state) => state.setCameraTarget);

  const panTo = useCallback(
    (target: HexCoord) => {
      if (!camera) return;

      // Convert hex to world position for camera
      const worldPos: WorldPosition = { x: target.q, y: 0, z: target.r };
      panCameraTo(camera, worldPos, true);
      setCameraTarget(target);
    },
    [camera, setCameraTarget],
  );

  return { panTo };
}

/**
 * Hook for frame-based game loop updates
 */
export function useGameLoop(
  callback: (deltaTime: number) => void,
  dependencies: unknown[] = [],
) {
  const callbackRef = useRef(callback);
  const isPaused = useGameStore((state) => state.isPaused);

  // Update callback ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (isPaused) return;

    let lastTime = performance.now();
    let animationFrame: number;

    const loop = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      callbackRef.current(deltaTime);

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPaused, ...dependencies]);
}

/**
 * Hook to track FPS
 */
export function useFPS() {
  const [fps, setFps] = useState(0);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = performance.now();
      const elapsed = (currentTime - lastTimeRef.current) / 1000;
      const currentFps = Math.round(framesRef.current / elapsed);

      setFps(currentFps);
      framesRef.current = 0;
      lastTimeRef.current = currentTime;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tick = useCallback(() => {
    framesRef.current++;
  }, []);

  return { fps, tick };
}

/**
 * Hook to handle keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const togglePause = useGameStore((state) => state.togglePause);
  const toggleGrid = useGameStore((state) => state.toggleGrid);
  const nextTurn = useGameStore((state) => state.nextTurn);
  const clearSelection = useGameStore((state) => state.clearSelection);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          clearSelection();
          break;
        case ' ':
          event.preventDefault();
          togglePause();
          break;
        case 'g':
          toggleGrid();
          break;
        case 'Enter':
          nextTurn();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, toggleGrid, nextTurn, clearSelection]);
}
