/**
 * Navigation system using BabylonJS Navigation Plugin V2 + Recast
 *
 * Provides pathfinding, crowd simulation, and obstacle avoidance
 * Replaces YukaJS for better BabylonJS integration
 */

import type { Mesh, Scene, TransformNode, Vector3 } from '@babylonjs/core';
import { RecastJSPlugin } from '@babylonjs/core/Navigation/Plugins/recastJSPlugin';
import type { ICrowd, INavMeshParameters } from '@babylonjs/core/Navigation/INavigationEngine';
import type { HexCoord, WorldPosition } from '@cosmic-cults/types';
import { hexToWorld } from '@cosmic-cults/core';

// Navigation plugin singleton
let navigationPlugin: RecastJSPlugin | null = null;
let crowd: ICrowd | null = null;

/**
 * Default navigation mesh parameters for hex-based terrain
 */
export const DEFAULT_NAVMESH_PARAMS: INavMeshParameters = {
  cs: 0.2, // Cell size
  ch: 0.2, // Cell height
  walkableSlopeAngle: 35,
  walkableHeight: 1,
  walkableClimb: 1,
  walkableRadius: 1,
  maxEdgeLen: 12,
  maxSimplificationError: 1.3,
  minRegionArea: 8,
  mergeRegionArea: 20,
  maxVertsPerPoly: 6,
  detailSampleDist: 6,
  detailSampleMaxError: 1,
};

/**
 * Initialize the navigation system
 */
export async function initializeNavigation(_scene: Scene): Promise<RecastJSPlugin> {
  if (navigationPlugin) {
    return navigationPlugin;
  }

  // Dynamically import Recast to avoid SSR issues
  const Recast = await import('recast-navigation');
  await Recast.init();

  navigationPlugin = new RecastJSPlugin(Recast);
  return navigationPlugin;
}

/**
 * Get the navigation plugin instance
 */
export function getNavigationPlugin(): RecastJSPlugin | null {
  return navigationPlugin;
}

/**
 * Build a navigation mesh from terrain meshes
 */
export function buildNavMesh(
  meshes: Mesh[],
  params: Partial<INavMeshParameters> = {},
): void {
  if (!navigationPlugin) {
    throw new Error('Navigation not initialized. Call initializeNavigation first.');
  }

  const navParams = { ...DEFAULT_NAVMESH_PARAMS, ...params };
  navigationPlugin.createNavMesh(meshes, navParams);
}

/**
 * Create a crowd for pathfinding and steering
 */
export function createCrowd(
  scene: Scene,
  maxAgents: number = 100,
  maxAgentRadius: number = 0.6,
): ICrowd {
  if (!navigationPlugin) {
    throw new Error('Navigation not initialized. Call initializeNavigation first.');
  }

  crowd = navigationPlugin.createCrowd(maxAgents, maxAgentRadius, scene);
  return crowd;
}

/**
 * Get the current crowd instance
 */
export function getCrowd(): ICrowd | null {
  return crowd;
}

/**
 * Add an agent to the crowd
 */
export function addAgent(
  position: Vector3,
  parameters: Partial<IAgentParameters> = {},
): number {
  if (!crowd) {
    throw new Error('Crowd not created. Call createCrowd first.');
  }

  const defaultParams: IAgentParameters = {
    radius: 0.4,
    height: 1.8,
    maxAcceleration: 4.0,
    maxSpeed: 1.5,
    collisionQueryRange: 0.5,
    pathOptimizationRange: 0.0,
    separationWeight: 1.0,
  };

  const agentParams = { ...defaultParams, ...parameters };
  return crowd.addAgent(position, agentParams, null as unknown as TransformNode);
}

/**
 * Agent parameters interface
 */
export interface IAgentParameters {
  radius: number;
  height: number;
  maxAcceleration: number;
  maxSpeed: number;
  collisionQueryRange: number;
  pathOptimizationRange: number;
  separationWeight: number;
}

/**
 * Remove an agent from the crowd
 */
export function removeAgent(agentIndex: number): void {
  if (!crowd) return;
  crowd.removeAgent(agentIndex);
}

/**
 * Set agent destination using hex coordinates
 */
export function setAgentDestinationHex(
  agentIndex: number,
  hexDest: HexCoord,
): void {
  if (!crowd || !navigationPlugin) return;

  const worldPos = hexToWorld(hexDest);
  const closest = navigationPlugin.getClosestPoint(
    { x: worldPos.x, y: 0.1, z: worldPos.z } as Vector3,
  );
  crowd.agentGoto(agentIndex, closest);
}

/**
 * Set agent destination using world position
 */
export function setAgentDestination(
  agentIndex: number,
  destination: Vector3,
): void {
  if (!crowd || !navigationPlugin) return;

  const closest = navigationPlugin.getClosestPoint(destination);
  crowd.agentGoto(agentIndex, closest);
}

/**
 * Get agent current position
 */
export function getAgentPosition(agentIndex: number): Vector3 | null {
  if (!crowd) return null;
  return crowd.getAgentPosition(agentIndex);
}

/**
 * Get agent velocity
 */
export function getAgentVelocity(agentIndex: number): Vector3 | null {
  if (!crowd) return null;
  return crowd.getAgentVelocity(agentIndex);
}

/**
 * Check if agent has reached destination
 */
export function hasAgentReachedDestination(
  agentIndex: number,
  threshold: number = 0.5,
): boolean {
  if (!crowd) return true;

  const velocity = crowd.getAgentVelocity(agentIndex);
  if (!velocity) return true;

  // If velocity is very low, agent has likely reached destination
  const speed = Math.sqrt(
    velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z,
  );
  return speed < threshold;
}

/**
 * Find path between two hex coordinates
 */
export function findPathHex(
  start: HexCoord,
  end: HexCoord,
): WorldPosition[] | null {
  if (!navigationPlugin) return null;

  const startWorld = hexToWorld(start);
  const endWorld = hexToWorld(end);

  const path = navigationPlugin.computePath(
    { x: startWorld.x, y: 0.1, z: startWorld.z } as Vector3,
    { x: endWorld.x, y: 0.1, z: endWorld.z } as Vector3,
  );

  if (!path || path.length === 0) return null;

  return path.map((p: Vector3) => ({ x: p.x, y: p.y, z: p.z }));
}

/**
 * Check if a position is walkable
 */
export function isWalkable(position: WorldPosition): boolean {
  if (!navigationPlugin) return false;

  const closest = navigationPlugin.getClosestPoint(
    { x: position.x, y: position.y, z: position.z } as Vector3,
  );

  // If closest point is far from original, position is not walkable
  const dx = closest.x - position.x;
  const dz = closest.z - position.z;
  const distSq = dx * dx + dz * dz;

  return distSq < 0.25; // Within 0.5 units
}

/**
 * Get a random walkable position within radius
 */
export function getRandomWalkablePosition(
  center: WorldPosition,
  radius: number,
): WorldPosition | null {
  if (!navigationPlugin) return null;

  const randomPoint = navigationPlugin.getRandomPointAround(
    { x: center.x, y: center.y, z: center.z } as Vector3,
    radius,
  );

  if (!randomPoint) return null;

  return { x: randomPoint.x, y: randomPoint.y, z: randomPoint.z };
}

/**
 * Update the crowd simulation (call each frame)
 */
export function updateCrowd(deltaTime: number): void {
  if (!crowd) return;
  crowd.update(deltaTime);
}

/**
 * Dispose of navigation resources
 */
export function disposeNavigation(): void {
  if (crowd) {
    crowd.dispose();
    crowd = null;
  }
  if (navigationPlugin) {
    navigationPlugin.dispose();
    navigationPlugin = null;
  }
}

/**
 * Create debug visualization for nav mesh
 */
export function createNavMeshDebug(scene: Scene): Mesh | null {
  if (!navigationPlugin) return null;
  return navigationPlugin.createDebugNavMesh(scene);
}
