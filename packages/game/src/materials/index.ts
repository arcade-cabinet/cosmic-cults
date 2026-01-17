/**
 * Cel-shaded materials for Lovecraftian aesthetic
 *
 * Uses BabylonJS CellMaterial for stylized rendering with outlines
 */

import type { Mesh, Scene } from '@babylonjs/core';
import {
  Color3,
  Effect,
  ShaderMaterial,
  StandardMaterial,
} from '@babylonjs/core';
import { CellMaterial as BabylonCellMaterial } from '@babylonjs/materials';
import { FACTION_COLORS, type FactionId } from '@cosmic-cults/types';

// Material cache
const materialCache = new Map<string, StandardMaterial | BabylonCellMaterial>();

/**
 * Create a cel-shaded material
 */
export function createCelMaterial(
  name: string,
  scene: Scene,
  baseColor: Color3,
): BabylonCellMaterial {
  const cacheKey = `cel-${name}`;
  if (materialCache.has(cacheKey)) {
    return materialCache.get(cacheKey) as BabylonCellMaterial;
  }

  const material = new BabylonCellMaterial(name, scene);
  material.diffuseColor = baseColor;
  material.computeHighLevel = true;

  materialCache.set(cacheKey, material);
  return material;
}

/**
 * Get faction-colored cel material
 */
export function getFactionMaterial(
  faction: FactionId,
  scene: Scene,
): BabylonCellMaterial {
  const colorHex = FACTION_COLORS[faction];
  const color = Color3.FromHexString(colorHex);
  return createCelMaterial(`faction-${faction}`, scene, color);
}

/**
 * Create terrain material based on terrain type
 */
export function getTerrainMaterial(
  terrainType: string,
  scene: Scene,
): StandardMaterial {
  const cacheKey = `terrain-${terrainType}`;
  if (materialCache.has(cacheKey)) {
    return materialCache.get(cacheKey) as StandardMaterial;
  }

  const material = new StandardMaterial(`terrain-${terrainType}`, scene);

  switch (terrainType) {
    case 'void':
      material.diffuseColor = new Color3(0.1, 0.05, 0.15);
      material.emissiveColor = new Color3(0.05, 0, 0.1);
      break;
    case 'corrupted':
      material.diffuseColor = new Color3(0.3, 0.1, 0.2);
      material.emissiveColor = new Color3(0.1, 0, 0.05);
      break;
    case 'sanctified':
      material.diffuseColor = new Color3(0.9, 0.85, 0.7);
      material.emissiveColor = new Color3(0.1, 0.08, 0.05);
      break;
    default:
      material.diffuseColor = new Color3(0.4, 0.35, 0.3);
      break;
  }

  materialCache.set(cacheKey, material);
  return material;
}

/**
 * Create fog of war overlay material
 */
export function getFogMaterial(
  scene: Scene,
  opacity: number = 0.8,
): StandardMaterial {
  const cacheKey = `fog-${opacity}`;
  if (materialCache.has(cacheKey)) {
    return materialCache.get(cacheKey) as StandardMaterial;
  }

  const material = new StandardMaterial('fog', scene);
  material.diffuseColor = new Color3(0.05, 0.05, 0.1);
  material.alpha = opacity;
  material.disableLighting = true;

  materialCache.set(cacheKey, material);
  return material;
}

/**
 * Create outline shader for selected units
 */
export function createOutlineShader(scene: Scene): ShaderMaterial {
  // Define outline shader
  const shaderName = 'outlineShader';

  if (!Effect.ShadersStore[`${shaderName}VertexShader`]) {
    Effect.ShadersStore[`${shaderName}VertexShader`] = `
      precision highp float;
      attribute vec3 position;
      attribute vec3 normal;
      uniform mat4 worldViewProjection;
      uniform float outlineWidth;
      void main() {
        vec3 expandedPosition = position + normal * outlineWidth;
        gl_Position = worldViewProjection * vec4(expandedPosition, 1.0);
      }
    `;

    Effect.ShadersStore[`${shaderName}FragmentShader`] = `
      precision highp float;
      uniform vec3 outlineColor;
      void main() {
        gl_FragColor = vec4(outlineColor, 1.0);
      }
    `;
  }

  const material = new ShaderMaterial(
    'outline',
    scene,
    { vertex: shaderName, fragment: shaderName },
    {
      attributes: ['position', 'normal'],
      uniforms: ['worldViewProjection', 'outlineWidth', 'outlineColor'],
    },
  );

  material.setFloat('outlineWidth', 0.03);
  material.setColor3('outlineColor', new Color3(1, 1, 0)); // Yellow outline
  material.backFaceCulling = false;

  return material;
}

/**
 * Apply selection outline to a mesh
 */
export function applySelectionOutline(mesh: Mesh, scene: Scene): void {
  const outlineMesh = mesh.clone(`${mesh.name}-outline`);
  if (outlineMesh) {
    outlineMesh.material = createOutlineShader(scene);
    outlineMesh.scaling.scaleInPlace(1.02);
    outlineMesh.isPickable = false;
    mesh.metadata = { ...mesh.metadata, outlineMesh };
  }
}

/**
 * Remove selection outline from a mesh
 */
export function removeSelectionOutline(mesh: Mesh): void {
  const outlineMesh = mesh.metadata?.outlineMesh;
  if (outlineMesh) {
    outlineMesh.dispose();
    delete mesh.metadata.outlineMesh;
  }
}

/**
 * Clear material cache
 */
export function clearMaterialCache(): void {
  materialCache.forEach((material) => {
    material.dispose();
  });
  materialCache.clear();
}
