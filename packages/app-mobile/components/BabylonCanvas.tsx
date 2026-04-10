import type { Scene as BabylonScene, Camera } from '@babylonjs/core';
import { EngineView, useEngine } from '@babylonjs/react-native';
import type React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Scene } from 'reactylon';

export const BabylonCanvas = ({ children }: { children: React.ReactNode }) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();

  const handleSceneReady = (scene: BabylonScene) => {
    // If the scene has a camera, set it for the view
    if (scene.activeCamera) {
      setCamera(scene.activeCamera);
    }
  };

  return (
    <View style={styles.container}>
      <EngineView camera={camera} displayFrameRate={true} style={styles.view} />
      {engine && <Scene onSceneReady={handleSceneReady}>{children}</Scene>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
});
