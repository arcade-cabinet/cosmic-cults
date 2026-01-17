/**
 * Procedural Generation System
 *
 * Generates game content procedurally:
 * - Unit meshes with variations
 * - Terrain features
 * - Particle effects
 * - Animation variations
 */

import {
  Color3,
  Color4,
  DynamicTexture,
  Mesh,
  MeshBuilder,
  ParticleSystem,
  type Scene,
  StandardMaterial,
  Texture,
  Vector3,
  VertexBuffer,
} from '@babylonjs/core';
import { CellMaterial } from '@babylonjs/materials';
import type { FactionId, UnitType } from '@cosmic-cults/types';
import { FACTION_COLORS } from '@cosmic-cults/types';

// Seeded random for reproducibility
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

/**
 * Unit mesh generation configuration
 */
interface UnitMeshConfig {
  type: UnitType;
  faction: FactionId;
  seed: number;
}

/**
 * Generate a procedural unit mesh
 */
export function generateUnitMesh(
  config: UnitMeshConfig,
  scene: Scene,
): Mesh {
  const rng = new SeededRandom(config.seed);
  const factionColor = Color3.FromHexString(FACTION_COLORS[config.faction]);

  // Base shape depends on unit type
  let mesh: Mesh;

  switch (config.type) {
    case 'cultist':
      mesh = generateCultistMesh(rng, scene);
      break;
    case 'acolyte':
      mesh = generateAcolyteMesh(rng, scene);
      break;
    case 'priest':
      mesh = generatePriestMesh(rng, scene);
      break;
    case 'avatar':
      mesh = generateAvatarMesh(rng, scene);
      break;
    default:
      mesh = generateCultistMesh(rng, scene);
  }

  // Apply faction material
  const material = new CellMaterial(`unit-${config.faction}-${config.seed}`, scene);
  material.diffuseColor = factionColor;
  material.computeHighLevel = true;
  mesh.material = material;

  return mesh;
}

/**
 * Generate cultist mesh (basic humanoid)
 */
function generateCultistMesh(rng: SeededRandom, scene: Scene): Mesh {
  // Body
  const body = MeshBuilder.CreateCylinder(
    'cultist-body',
    {
      height: 0.6 + rng.range(-0.05, 0.05),
      diameterTop: 0.2,
      diameterBottom: 0.25 + rng.range(-0.02, 0.02),
      tessellation: 8,
    },
    scene,
  );
  body.position.y = 0.4;

  // Head
  const head = MeshBuilder.CreateSphere(
    'cultist-head',
    {
      diameter: 0.2 + rng.range(-0.02, 0.02),
      segments: 8,
    },
    scene,
  );
  head.position.y = 0.85;
  head.parent = body;

  // Merge meshes
  const merged = Mesh.MergeMeshes([body, head], true, true, undefined, false, true);
  if (!merged) throw new Error('Failed to merge cultist mesh');

  merged.name = 'cultist';
  return merged;
}

/**
 * Generate acolyte mesh (hooded figure)
 */
function generateAcolyteMesh(rng: SeededRandom, scene: Scene): Mesh {
  // Robe body
  const robe = MeshBuilder.CreateCylinder(
    'acolyte-robe',
    {
      height: 0.8 + rng.range(-0.05, 0.05),
      diameterTop: 0.15,
      diameterBottom: 0.4 + rng.range(-0.03, 0.03),
      tessellation: 12,
    },
    scene,
  );
  robe.position.y = 0.4;

  // Hood (cone)
  const hood = MeshBuilder.CreateCylinder(
    'acolyte-hood',
    {
      height: 0.25,
      diameterTop: 0,
      diameterBottom: 0.25,
      tessellation: 12,
    },
    scene,
  );
  hood.position.y = 0.95;
  hood.parent = robe;

  // Staff
  const staff = MeshBuilder.CreateCylinder(
    'acolyte-staff',
    {
      height: 1.2,
      diameter: 0.03,
      tessellation: 6,
    },
    scene,
  );
  staff.position.set(0.2, 0.6, 0);
  staff.parent = robe;

  // Staff orb
  const orb = MeshBuilder.CreateSphere(
    'acolyte-orb',
    {
      diameter: 0.08,
      segments: 8,
    },
    scene,
  );
  orb.position.set(0.2, 1.22, 0);
  orb.parent = robe;

  const merged = Mesh.MergeMeshes(
    [robe, hood, staff, orb],
    true,
    true,
    undefined,
    false,
    true,
  );
  if (!merged) throw new Error('Failed to merge acolyte mesh');

  merged.name = 'acolyte';
  return merged;
}

/**
 * Generate priest mesh (elaborate robed figure)
 */
function generatePriestMesh(rng: SeededRandom, scene: Scene): Mesh {
  // Elaborate robe
  const robe = MeshBuilder.CreateCylinder(
    'priest-robe',
    {
      height: 1.0 + rng.range(-0.05, 0.05),
      diameterTop: 0.2,
      diameterBottom: 0.5 + rng.range(-0.03, 0.03),
      tessellation: 16,
    },
    scene,
  );
  robe.position.y = 0.5;

  // Head/mask
  const head = MeshBuilder.CreateBox(
    'priest-head',
    {
      width: 0.2,
      height: 0.25 + rng.range(-0.02, 0.02),
      depth: 0.15,
    },
    scene,
  );
  head.position.y = 1.15;
  head.parent = robe;

  // Crown/horns
  const horn1 = MeshBuilder.CreateCylinder(
    'priest-horn1',
    {
      height: 0.15,
      diameterTop: 0,
      diameterBottom: 0.05,
      tessellation: 6,
    },
    scene,
  );
  horn1.position.set(-0.08, 1.35, 0);
  horn1.rotation.z = -0.3;
  horn1.parent = robe;

  const horn2 = horn1.clone('priest-horn2');
  horn2.position.x = 0.08;
  horn2.rotation.z = 0.3;

  // Ritual symbol (floating)
  const symbol = MeshBuilder.CreateTorus(
    'priest-symbol',
    {
      diameter: 0.15,
      thickness: 0.02,
      tessellation: 16,
    },
    scene,
  );
  symbol.position.set(0, 1.5, 0.15);
  symbol.rotation.x = Math.PI / 2;
  symbol.parent = robe;

  const merged = Mesh.MergeMeshes(
    [robe, head, horn1, horn2, symbol],
    true,
    true,
    undefined,
    false,
    true,
  );
  if (!merged) throw new Error('Failed to merge priest mesh');

  merged.name = 'priest';
  return merged;
}

/**
 * Generate avatar mesh (massive eldritch entity)
 */
function generateAvatarMesh(rng: SeededRandom, scene: Scene): Mesh {
  // Central mass
  const body = MeshBuilder.CreateSphere(
    'avatar-body',
    {
      diameter: 1.0 + rng.range(-0.1, 0.1),
      segments: 16,
    },
    scene,
  );
  body.position.y = 0.8;

  // Tentacles (simplified as cylinders)
  const tentacles: Mesh[] = [];
  const tentacleCount = 4 + rng.int(0, 2);

  for (let i = 0; i < tentacleCount; i++) {
    const angle = (i / tentacleCount) * Math.PI * 2 + rng.range(-0.2, 0.2);
    const tentacle = MeshBuilder.CreateCylinder(
      `avatar-tentacle-${i}`,
      {
        height: 0.8 + rng.range(-0.1, 0.1),
        diameterTop: 0.02,
        diameterBottom: 0.1,
        tessellation: 8,
      },
      scene,
    );

    tentacle.position.set(
      Math.cos(angle) * 0.4,
      0.3,
      Math.sin(angle) * 0.4,
    );
    tentacle.rotation.set(
      Math.cos(angle) * 0.8,
      0,
      -Math.sin(angle) * 0.8,
    );
    tentacle.parent = body;
    tentacles.push(tentacle);
  }

  // Eye
  const eye = MeshBuilder.CreateSphere(
    'avatar-eye',
    {
      diameter: 0.3,
      segments: 12,
    },
    scene,
  );
  eye.position.set(0, 1.1, 0.35);
  eye.parent = body;

  // Halo/crown
  const halo = MeshBuilder.CreateTorus(
    'avatar-halo',
    {
      diameter: 0.8,
      thickness: 0.05,
      tessellation: 24,
    },
    scene,
  );
  halo.position.y = 1.4;
  halo.parent = body;

  const allMeshes = [body, eye, halo, ...tentacles];
  const merged = Mesh.MergeMeshes(allMeshes, true, true, undefined, false, true);
  if (!merged) throw new Error('Failed to merge avatar mesh');

  merged.name = 'avatar';
  merged.scaling.setAll(1.5); // Avatars are big
  return merged;
}

/**
 * Generate a procedural face texture for units
 */
export function generateFaceTexture(
  faction: FactionId,
  seed: number,
  scene: Scene,
): DynamicTexture {
  const texture = new DynamicTexture(
    `face-${faction}-${seed}`,
    { width: 256, height: 256 },
    scene,
    false,
  );

  const ctx = texture.getContext();
  const rng = new SeededRandom(seed);

  // Background (faction color)
  const factionColor = FACTION_COLORS[faction];
  ctx.fillStyle = factionColor;
  ctx.fillRect(0, 0, 256, 256);

  // Eyes
  ctx.fillStyle = '#fff';
  const eyeY = 100 + rng.range(-10, 10);
  const eyeSpacing = 50 + rng.range(-5, 5);

  // Left eye
  ctx.beginPath();
  ctx.arc(128 - eyeSpacing / 2, eyeY, 15 + rng.range(-3, 3), 0, Math.PI * 2);
  ctx.fill();

  // Right eye
  ctx.beginPath();
  ctx.arc(128 + eyeSpacing / 2, eyeY, 15 + rng.range(-3, 3), 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(128 - eyeSpacing / 2, eyeY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(128 + eyeSpacing / 2, eyeY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Symbol on forehead (faction-specific)
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;

  switch (faction) {
    case 'void-seekers':
      // Triangle
      ctx.beginPath();
      ctx.moveTo(128, 50);
      ctx.lineTo(108, 80);
      ctx.lineTo(148, 80);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'flesh-weavers':
      // Spiral
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        const angle = i * 0.5;
        const r = 5 + i * 1.5;
        const x = 128 + Math.cos(angle) * r;
        const y = 65 + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    case 'star-children':
      // Star
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;
        const ox = 128 + Math.cos(outerAngle) * 15;
        const oy = 65 + Math.sin(outerAngle) * 15;
        const ix = 128 + Math.cos(innerAngle) * 7;
        const iy = 65 + Math.sin(innerAngle) * 7;
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.stroke();
      break;
  }

  texture.update();
  return texture;
}

/**
 * Generate terrain feature mesh
 */
export function generateTerrainFeature(
  type: 'rock' | 'pillar' | 'crystal' | 'altar',
  seed: number,
  scene: Scene,
): Mesh {
  const rng = new SeededRandom(seed);
  let mesh: Mesh;

  switch (type) {
    case 'rock':
      mesh = MeshBuilder.CreatePolyhedron(
        'rock',
        {
          type: rng.int(0, 4),
          size: 0.2 + rng.range(-0.05, 0.1),
        },
        scene,
      );
      mesh.position.y = 0.15;
      break;

    case 'pillar':
      mesh = MeshBuilder.CreateCylinder(
        'pillar',
        {
          height: 0.8 + rng.range(-0.2, 0.3),
          diameterTop: 0.1,
          diameterBottom: 0.15 + rng.range(-0.02, 0.02),
          tessellation: 6,
        },
        scene,
      );
      mesh.position.y = 0.4;
      break;

    case 'crystal':
      mesh = MeshBuilder.CreateCylinder(
        'crystal',
        {
          height: 0.5 + rng.range(-0.1, 0.2),
          diameterTop: 0,
          diameterBottom: 0.15,
          tessellation: 4 + rng.int(0, 2),
        },
        scene,
      );
      mesh.position.y = 0.3;
      mesh.rotation.x = rng.range(-0.2, 0.2);
      mesh.rotation.z = rng.range(-0.2, 0.2);
      break;

    case 'altar':
      const base = MeshBuilder.CreateBox(
        'altar-base',
        {
          width: 0.4,
          height: 0.2,
          depth: 0.4,
        },
        scene,
      );
      base.position.y = 0.1;

      const top = MeshBuilder.CreateBox(
        'altar-top',
        {
          width: 0.5,
          height: 0.1,
          depth: 0.5,
        },
        scene,
      );
      top.position.y = 0.25;
      top.parent = base;

      mesh = Mesh.MergeMeshes([base, top], true, true, undefined, false, true)!;
      mesh.name = 'altar';
      break;

    default:
      mesh = MeshBuilder.CreateBox('default', { size: 0.2 }, scene);
  }

  // Apply basic material
  const material = new StandardMaterial(`feature-${type}-${seed}`, scene);
  material.diffuseColor = new Color3(0.4, 0.35, 0.3);
  mesh.material = material;

  return mesh;
}

/**
 * Create a summoning particle effect
 */
export function createSummoningEffect(
  position: Vector3,
  faction: FactionId,
  scene: Scene,
): ParticleSystem {
  const particles = new ParticleSystem('summoning', 500, scene);

  // Use a built-in particle texture
  particles.particleTexture = new Texture(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQYV2P8////fwYKAOOoAuaAUQXUA0AA//8KlwNtCAIAAAAASUVORK5CYII=',
    scene,
  );

  particles.emitter = position;

  // Faction colors
  const color = Color4.FromHexString(FACTION_COLORS[faction] + 'ff');
  const colorEnd = new Color4(color.r, color.g, color.b, 0);

  particles.color1 = color;
  particles.color2 = color;
  particles.colorDead = colorEnd;

  particles.minSize = 0.05;
  particles.maxSize = 0.15;

  particles.minLifeTime = 0.5;
  particles.maxLifeTime = 1.5;

  particles.emitRate = 100;

  // Spiral emission
  particles.createCylinderEmitter(0.3, 0.5, 0, 0);

  particles.minEmitPower = 0.5;
  particles.maxEmitPower = 1.5;

  particles.updateSpeed = 0.01;

  return particles;
}

/**
 * Create a damage/hit effect
 */
export function createDamageEffect(
  position: Vector3,
  scene: Scene,
): ParticleSystem {
  const particles = new ParticleSystem('damage', 100, scene);

  particles.particleTexture = new Texture(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQYV2P8////fwYKAOOoAuaAUQXUA0AA//8KlwNtCAIAAAAASUVORK5CYII=',
    scene,
  );

  particles.emitter = position;

  particles.color1 = new Color4(1, 0.2, 0.2, 1);
  particles.color2 = new Color4(1, 0.5, 0, 1);
  particles.colorDead = new Color4(0.2, 0, 0, 0);

  particles.minSize = 0.05;
  particles.maxSize = 0.2;

  particles.minLifeTime = 0.2;
  particles.maxLifeTime = 0.5;

  particles.emitRate = 0; // Manual burst
  particles.manualEmitCount = 50;

  particles.createSphereEmitter(0.1);

  particles.minEmitPower = 2;
  particles.maxEmitPower = 4;

  particles.gravity = new Vector3(0, -5, 0);

  return particles;
}

/**
 * Create a healing/buff effect
 */
export function createHealEffect(
  position: Vector3,
  scene: Scene,
): ParticleSystem {
  const particles = new ParticleSystem('heal', 100, scene);

  particles.particleTexture = new Texture(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQYV2P8////fwYKAOOoAuaAUQXUA0AA//8KlwNtCAIAAAAASUVORK5CYII=',
    scene,
  );

  particles.emitter = position;

  particles.color1 = new Color4(0.2, 1, 0.4, 1);
  particles.color2 = new Color4(0.4, 1, 0.6, 1);
  particles.colorDead = new Color4(0.1, 0.5, 0.2, 0);

  particles.minSize = 0.03;
  particles.maxSize = 0.1;

  particles.minLifeTime = 1;
  particles.maxLifeTime = 2;

  particles.emitRate = 30;

  particles.createCylinderEmitter(0.2, 0, 0, 0);

  particles.minEmitPower = 0.5;
  particles.maxEmitPower = 1;

  particles.gravity = new Vector3(0, 0.5, 0); // Float upward

  return particles;
}

/**
 * Generate a simple vertex-based noise mesh for organic terrain
 */
export function generateNoisyMesh(
  baseMesh: Mesh,
  amplitude: number,
  frequency: number,
  seed: number,
): void {
  const positions = baseMesh.getVerticesData(VertexBuffer.PositionKind);
  if (!positions) return;

  const rng = new SeededRandom(seed);

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i] ?? 0;
    const y = positions[i + 1] ?? 0;
    const z = positions[i + 2] ?? 0;

    // Simple noise displacement
    const noise =
      Math.sin(x * frequency + rng.next() * 0.1) *
      Math.cos(z * frequency + rng.next() * 0.1) *
      amplitude;

    positions[i + 1] = y + noise; // Displace Y
  }

  baseMesh.updateVerticesData(VertexBuffer.PositionKind, positions);
  baseMesh.createNormals(true); // Recalculate normals
}
