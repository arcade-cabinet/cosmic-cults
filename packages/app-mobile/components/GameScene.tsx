import React from 'react';
import { Vector3, Color3 } from '@babylonjs/core';

export const GameScene = () => {
  return (
    <>
      <arcRotateCamera
        name="camera1"
        alpha={Math.PI / 4}
        beta={Math.PI / 3}
        radius={10}
        target={Vector3.Zero()}
      />
      <hemisphericLight name="light1" direction={Vector3.Up()} />
      <box name="box1" size={2} position={new Vector3(0, 1, 0)}>
        <standardMaterial name="mat1" diffuseColor={Color3.Red()} />
      </box>
    </>
  );
};
