import { Color3, Vector3 } from '@babylonjs/core';
import type React from 'react';
import { useMemo } from 'react';

interface HexMeshProps {
  size?: number;
  height?: number;
  color?: Color3;
  type?: 'plains' | 'mountain' | 'water' | 'void';
}

/**
 * Procedurally generates a hex tile mesh.
 */
export const HexMesh: React.FC<HexMeshProps> = ({
  size = 1,
  height = 0.2,
  color,
  type = 'plains',
}) => {
  const meshData = useMemo(() => {
    // Generate hex prism data
    // In a real advanced procgen, we would generate custom VertexData here
    // For now, we use a Cylinder with 6 segments as a Hex Prism

    let baseColor = color;
    let finalHeight = height;
    let detail: React.ReactNode = null;

    if (!baseColor) {
      switch (type) {
        case 'plains':
          baseColor = Color3.Green();
          break;
        case 'mountain':
          baseColor = Color3.Gray();
          finalHeight = height * 3;
          break;
        case 'water':
          baseColor = Color3.Blue();
          finalHeight = height * 0.5;
          break;
        case 'void':
          baseColor = Color3.Purple();
          break;
        default:
          baseColor = Color3.White();
      }
    }

    if (type === 'mountain') {
      // Add snow cap
      detail = (
        <cylinder
          name="snow_cap"
          options={{
            height: finalHeight * 0.2,
            diameter: size * 0.8,
            tessellation: 6,
          }}
          position={new Vector3(0, finalHeight / 2 + 0.05, 0)}
        >
          <standardMaterial name="mat_snow" diffuseColor={Color3.White()} />
        </cylinder>
      );
    }

    return { color: baseColor, height: finalHeight, detail };
  }, [size, height, color, type]);

  return (
    <transformNode name="hex_tile">
      <cylinder
        name="hex_prism"
        options={{
          height: meshData.height,
          diameter: size * 2, // Diameter is point-to-point?
          tessellation: 6,
        }}
      >
        <standardMaterial name="mat_hex" diffuseColor={meshData.color} />
      </cylinder>
      {meshData.detail}
    </transformNode>
  );
};
