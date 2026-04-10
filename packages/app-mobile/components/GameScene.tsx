import { Vector3 } from '@babylonjs/core';
import { HexMesh, UnitMesh } from '@cosmic-cults/assets';

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

      {/* Procedural Diorama Display */}

      {/* Center - Crimson Cultist on Mountain */}
      <transformNode name="center_display" position={Vector3.Zero()}>
        <HexMesh type="mountain" />
        <transformNode name="unit_pos" position={new Vector3(0, 0.6, 0)}>
          <UnitMesh faction="flesh-weavers" type="warrior" selected={true} />
        </transformNode>
      </transformNode>

      {/* Left - Deep One on Water */}
      <transformNode name="left_display" position={new Vector3(-2, 0, 0)}>
        <HexMesh type="water" />
        <transformNode name="unit_pos" position={new Vector3(0, 0.2, 0)}>
          <UnitMesh faction="star-children" type="guardian" />
        </transformNode>
      </transformNode>

      {/* Right - Void Walker on Void */}
      <transformNode name="right_display" position={new Vector3(2, 0, 0)}>
        <HexMesh type="void" />
        <transformNode name="unit_pos" position={new Vector3(0, 0.2, 0)}>
          <UnitMesh faction="void-seekers" type="walker" />
        </transformNode>
      </transformNode>
    </>
  );
};
