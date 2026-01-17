import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { EngineView, useEngine } from '@babylonjs/react-native';
import { Camera } from '@babylonjs/core';
import { Scene } from 'reactylon';

export const BabylonCanvas = ({ children }: { children: React.ReactNode }) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();

  return (
    <View style={styles.container}>
      <EngineView camera={camera} displayFrameRate={true} style={styles.view} />
      {engine && (
        <Scene
          engine={engine}
          onSceneMount={(e: any) => {
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
