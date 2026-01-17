import { Scene } from '@babylonjs/core';
import { useEffect } from 'react';
import { useScene } from 'reactylon';

export function useBeforeRender(callback: (scene: Scene) => void) {
  const scene = useScene();
  useEffect(() => {
    if (!scene) return;
    const observer = scene.onBeforeRenderObservable.add(() => callback(scene));
    return () => {
      scene.onBeforeRenderObservable.remove(observer);
    };
  }, [scene, callback]);
}
