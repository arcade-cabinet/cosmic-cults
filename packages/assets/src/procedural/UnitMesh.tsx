import { Color3, type TransformNode, Vector3 } from '@babylonjs/core';
import type { FactionId } from '@cosmic-cults/types';
import React, { useMemo } from 'react';
import { useBeforeRender } from '../hooks';

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
  selected = false,
}) => {
  // Rotation for idle animation
  const rootRef = React.useRef<TransformNode>(null);

  useBeforeRender(() => {
    if (rootRef.current) {
      // Gentle floating/breathing animation
      rootRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1 + 0.5;

      // Slow rotation for Void faction
      if (faction === 'void-seekers') {
        // biome-ignore lint/suspicious/noExplicitAny: rotation property access
        (rootRef.current as any).rotation.y += 0.01;
      }
    }
  });

  const colors = useMemo(() => {
    switch (faction) {
      case 'flesh-weavers': // Crimson/Flesh
        return {
          primary: Color3.Red(),
          secondary: new Color3(0.2, 0, 0),
          emissive: new Color3(0.5, 0, 0),
        };
      case 'star-children': // Deep/Water
        return {
          primary: Color3.Teal(),
          secondary: new Color3(0, 0.2, 0.2),
          emissive: new Color3(0, 0.5, 0.5),
        };
      default:
        return {
          primary: Color3.Purple(),
          secondary: Color3.Black(),
          emissive: new Color3(0.2, 0, 0.4),
        };
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
            <cylinder
              name="body"
              options={{
                height: 1.2,
                diameterTop: 0,
                diameterBottom: 0.8,
                tessellation: 6
              }}
            >
              <standardMaterial name="mat_body" diffuseColor={colors.primary} />
            </cylinder>
            {/* Head/Spike */}
            <sphere
              name="head"
              position={new Vector3(0, 0.8, 0)}
              options={{
                  diameter: 0.6
              }}
            >
              <standardMaterial
                name="mat_head"
                diffuseColor={colors.secondary}
                emissiveColor={colors.emissive}
              />
            </sphere>
            {/* Arms/Spikes */}
            <cylinder
              name="arm_l"
              position={new Vector3(-0.4, 0.5, 0)}
              rotation={new Vector3(0, 0, 1)}
              options={{
                  height: 1,
                  diameterTop: 0,
                  diameterBottom: 0.2
              }}
            >
              <standardMaterial
                name="mat_arm"
                diffuseColor={colors.secondary}
              />
            </cylinder>
            <cylinder
              name="arm_r"
              position={new Vector3(0.4, 0.5, 0)}
              rotation={new Vector3(0, 0, -1)}
              options={{
                  height: 1,
                  diameterTop: 0,
                  diameterBottom: 0.2
              }}
            >
              <standardMaterial
                name="mat_arm"
                diffuseColor={colors.secondary}
              />
            </cylinder>
          </>
        );

      case 'star-children': // Rounded, organic, aquatic
        return (
          <>
            {/* Core Body */}
            <sphere
              name="body"
              scaling={new Vector3(1, 1.2, 1)}
              options={{
                  diameter: 1,
                  segments: 16
              }}
            >
              <standardMaterial name="mat_body" diffuseColor={colors.primary} />
            </sphere>
            {/* Eye/Face */}
            <sphere
              name="eye"
              position={new Vector3(0, 0.4, 0.3)}
              options={{
                  diameter: 0.4
              }}
            >
              <standardMaterial
                name="mat_eye"
                diffuseColor={Color3.White()}
                emissiveColor={Color3.White()}
              />
            </sphere>
            {/* Ring/Fins */}
            <torus
              name="fins"
              position={new Vector3(0, 0, 0)}
              rotation={new Vector3(Math.PI / 2, 0, 0)}
              options={{
                  diameter: 1.2,
                  thickness: 0.1
              }}
            >
              <standardMaterial
                name="mat_fins"
                diffuseColor={colors.secondary}
              />
            </torus>
          </>
        );
      default:
        return (
          <>
            {/* Core Cube */}
            <box
              name="core"
              rotation={new Vector3(Math.PI / 4, Math.PI / 4, 0)}
              options={{
                  size: 0.6
              }}
            >
              <standardMaterial
                name="mat_core"
                diffuseColor={colors.primary}
                emissiveColor={colors.emissive}
              />
            </box>
            {/* Floating Satellites */}
            <box
              name="sat1"
              position={new Vector3(0.6, 0.4, 0)}
              rotation={new Vector3(0, 0.1, 0)}
              options={{
                  size: 0.2
              }}
            >
              <standardMaterial
                name="mat_sat"
                diffuseColor={colors.secondary}
              />
            </box>
            <box
              name="sat2"
              position={new Vector3(-0.6, -0.4, 0)}
              rotation={new Vector3(0, -0.1, 0)}
              options={{
                  size: 0.2
              }}
            >
              <standardMaterial
                name="mat_sat"
                diffuseColor={colors.secondary}
              />
            </box>
            {/* Energy Field (Wireframe Sphere) */}
            <sphere
                name="field"
                options={{
                    diameter: 1.5,
                    segments: 8
                }}
            >
              <standardMaterial
                name="mat_field"
                wireframe={true}
                diffuseColor={colors.emissive}
                alpha={0.3}
              />
            </sphere>
          </>
        );
    }
  };

  return (
    <transformNode
      name={`unit_${faction}_${type}`}
      ref={rootRef}
      scaling={new Vector3(scale, scale, scale)}
    >
      {renderGeometry()}
      {selected && (
        <torus
          name="selection_ring"
          position={new Vector3(0, -0.5, 0)}
          options={{
              diameter: 1.5,
              thickness: 0.05
          }}
        >
          <standardMaterial
            name="mat_sel"
            diffuseColor={selectionColor}
            emissiveColor={selectionColor}
          />
        </torus>
      )}
    </transformNode>
  );
};
