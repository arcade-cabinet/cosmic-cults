import { Color3, Vector3 } from '@babylonjs/core';
import type { FactionId } from '@cosmic-cults/types';
import React, { useMemo } from 'react';
import { useBeforeRender } from 'reactylon';

interface UnitMeshProps {
  faction: FactionId;
  type?: 'acolyte' | 'warrior' | 'guardian' | 'walker';
  scale?: number;
  selected?: boolean;
}

/**
 * Procedurally generates a unit mesh based on faction and type.
 * Uses composed primitives (Spheres, Boxes, Cylinders, Torus) to create distinct styles.
 */
export const UnitMesh: React.FC<UnitMeshProps> = ({
  faction,
  type = 'acolyte',
  scale = 1,
  selected = false
}) => {
  // Rotation for idle animation
  const rootRef = React.useRef<any>(null);

  useBeforeRender(() => {
    if (rootRef.current) {
      // Gentle floating/breathing animation
      rootRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1 + 0.5;

      // Slow rotation for Void faction
      if (faction === 'void-seekers') {
        rootRef.current.rotation.y += 0.01;
      }
    }
  });

  const colors = useMemo(() => {
    switch (faction) {
      case 'flesh-weavers': // Crimson/Flesh
        return { primary: Color3.Red(), secondary: new Color3(0.2, 0, 0), emissive: new Color3(0.5, 0, 0) };
      case 'star-children': // Deep/Water
        return { primary: Color3.Teal(), secondary: new Color3(0, 0.2, 0.2), emissive: new Color3(0, 0.5, 0.5) };
      case 'void-seekers': // Void/Shadow
      default:
        return { primary: Color3.Purple(), secondary: Color3.Black(), emissive: new Color3(0.2, 0, 0.4) };
    }
  }, [faction]);

  const selectionColor = Color3.Yellow();

  // Procedural Geometry Construction
  const renderGeometry = () => {
    switch (faction) {
      case 'flesh-weavers': // Spiky, aggressive
        return (
          <>
            {/* Core Body */}
            <cylinder name="body" height={1.2} diameterTop={0} diameterBottom={0.8} segments={6}>
              <standardMaterial name="mat_body" diffuseColor={colors.primary} />
            </cylinder>
            {/* Head/Spike */}
            <sphere name="head" diameter={0.6} position={new Vector3(0, 0.8, 0)}>
               <standardMaterial name="mat_head" diffuseColor={colors.secondary} emissiveColor={colors.emissive} />
            </sphere>
            {/* Arms/Spikes */}
            <cylinder name="arm_l" height={1} diameterTop={0} diameterBottom={0.2} position={new Vector3(-0.4, 0.5, 0)} rotation={new Vector3(0, 0, 1)}>
              <standardMaterial name="mat_arm" diffuseColor={colors.secondary} />
            </cylinder>
            <cylinder name="arm_r" height={1} diameterTop={0} diameterBottom={0.2} position={new Vector3(0.4, 0.5, 0)} rotation={new Vector3(0, 0, -1)}>
              <standardMaterial name="mat_arm" diffuseColor={colors.secondary} />
            </cylinder>
          </>
        );

      case 'star-children': // Rounded, organic, aquatic
        return (
          <>
            {/* Core Body */}
            <sphere name="body" diameter={1} segments={16} scale={new Vector3(1, 1.2, 1)}>
              <standardMaterial name="mat_body" diffuseColor={colors.primary} />
            </sphere>
            {/* Eye/Face */}
            <sphere name="eye" diameter={0.4} position={new Vector3(0, 0.4, 0.3)}>
              <standardMaterial name="mat_eye" diffuseColor={Color3.White()} emissiveColor={Color3.White()} />
            </sphere>
            {/* Ring/Fins */}
            <torus name="fins" diameter={1.2} thickness={0.1} position={new Vector3(0, 0, 0)} rotation={new Vector3(Math.PI/2, 0, 0)}>
              <standardMaterial name="mat_fins" diffuseColor={colors.secondary} />
            </torus>
          </>
        );

      case 'void-seekers': // Abstract, geometric, floating
      default:
        return (
          <>
            {/* Core Cube */}
            <box name="core" size={0.6} rotation={new Vector3(Math.PI/4, Math.PI/4, 0)}>
              <standardMaterial name="mat_core" diffuseColor={colors.primary} emissiveColor={colors.emissive} />
            </box>
            {/* Floating Satellites */}
            <box name="sat1" size={0.2} position={new Vector3(0.6, 0.4, 0)} rotation={new Vector3(0, 0.1, 0)}>
              <standardMaterial name="mat_sat" diffuseColor={colors.secondary} />
            </box>
            <box name="sat2" size={0.2} position={new Vector3(-0.6, -0.4, 0)} rotation={new Vector3(0, -0.1, 0)}>
              <standardMaterial name="mat_sat" diffuseColor={colors.secondary} />
            </box>
            {/* Energy Field (Wireframe Sphere) */}
            <sphere name="field" diameter={1.5} segments={8}>
              <standardMaterial name="mat_field" wireframe={true} diffuseColor={colors.emissive} alpha={0.3} />
            </sphere>
          </>
        );
    }
  };

  return (
    <transformNode name={`unit_${faction}_${type}`} ref={rootRef} scaling={new Vector3(scale, scale, scale)}>
       {renderGeometry()}
       {selected && (
         <torus name="selection_ring" diameter={1.5} thickness={0.05} position={new Vector3(0, -0.5, 0)}>
           <standardMaterial name="mat_sel" diffuseColor={selectionColor} emissiveColor={selectionColor} />
         </torus>
       )}
    </transformNode>
  );
};
