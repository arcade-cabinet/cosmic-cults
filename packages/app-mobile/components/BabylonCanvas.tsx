import type { Camera } from '@babylonjs/core';
import { EngineView, useEngine } from '@babylonjs/react-native';
import type React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Scene } from 'reactylon';

export const BabylonCanvas = ({ children }: { children: React.ReactNode }) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();

  return (
    <View style={styles.container}>
      <EngineView camera={camera} displayFrameRate={true} style={styles.view} />
      {engine && (
        <Scene
          // @ts-ignore: Reactylon v3 Scene types don't expose engine prop explicitly but it's needed for RN integration
          engine={engine}
          onSceneMount={(e: { scene: import('@babylonjs/core').Scene }) => {
            // If the scene has a camera, set it for the view
            if (e.scene.activeCamera) {
              setCamera(e.scene.activeCamera);
            }
          }}
        >
          {children}
        </Scene>
      )}
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
