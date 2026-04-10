/**
 * Isometric camera system for BabylonJS
 *
 * Provides FF7-style bounded diorama view with orthographic projection
 */

import type { Scene } from '@babylonjs/core';
import { ArcRotateCamera, Vector3 } from '@babylonjs/core';
import type { CameraConfig, WorldPosition } from '@cosmic-cults/types';

// Default isometric camera settings
export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  fov: 0.8, // Orthographic scale
  near: 0.1,
  far: 100,
  position: { x: 10, y: 10, z: 10 },
  target: { x: 0, y: 0, z: 0 },
};

// Isometric angle constants
const ISOMETRIC_ALPHA = Math.PI / 4; // 45 degrees horizontal
const ISOMETRIC_BETA = Math.atan(1 / Math.sqrt(2)); // ~35.264 degrees from horizontal

// Camera constraints
const MIN_RADIUS = 5;
const MAX_RADIUS = 50;
const PAN_SPEED = 0.5;
const ZOOM_SPEED = 0.1;

/**
 * Create an isometric camera for the scene
 */
export function createIsometricCamera(
  scene: Scene,
  canvas: HTMLCanvasElement | null,
  config: CameraConfig = DEFAULT_CAMERA_CONFIG,
): ArcRotateCamera {
  const camera = new ArcRotateCamera(
    'isometric-camera',
    ISOMETRIC_ALPHA,
    ISOMETRIC_BETA,
    15, // Initial radius
    new Vector3(config.target.x, config.target.y, config.target.z),
    scene,
  );

  // Enable orthographic projection for true isometric look
  camera.mode = ArcRotateCamera.ORTHOGRAPHIC_CAMERA;

  // Set orthographic size
  const aspectRatio = canvas ? canvas.width / canvas.height : 16 / 9;
  const orthoSize = config.fov * 10;
  camera.orthoLeft = -orthoSize * aspectRatio;
  camera.orthoRight = orthoSize * aspectRatio;
  camera.orthoTop = orthoSize;
  camera.orthoBottom = -orthoSize;

  // Lock rotation for true isometric (no rotation allowed)
  camera.lowerAlphaLimit = ISOMETRIC_ALPHA;
  camera.upperAlphaLimit = ISOMETRIC_ALPHA;
  camera.lowerBetaLimit = ISOMETRIC_BETA;
  camera.upperBetaLimit = ISOMETRIC_BETA;

  // Set zoom limits
  camera.lowerRadiusLimit = MIN_RADIUS;
  camera.upperRadiusLimit = MAX_RADIUS;

  // Configure touch/mouse input
  if (canvas) {
    camera.attachControl(canvas, true);
  }

  // Panning settings
  camera.panningAxis = new Vector3(1, 0, 1); // Horizontal panning only
  camera.panningSensibility = PAN_SPEED * 1000;

  // Zoom settings
  camera.wheelPrecision = 1 / ZOOM_SPEED;
  camera.pinchPrecision = 1 / ZOOM_SPEED;

  return camera;
}

/**
 * Pan the camera to a world position
 */
export function panCameraTo(
  camera: ArcRotateCamera,
  target: WorldPosition,
  smooth = true,
): void {
  const targetVector = new Vector3(target.x, target.y, target.z);

  if (smooth) {
    // Animate pan
    const startTarget = camera.target.clone();
    const duration = 500; // ms
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);

      camera.target = Vector3.Lerp(startTarget, targetVector, eased);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  } else {
    camera.target = targetVector;
  }
}

/**
 * Zoom the camera
 */
export function zoomCamera(camera: ArcRotateCamera, delta: number): void {
  // For orthographic camera, adjust the ortho size
  const newSize = (camera.orthoTop ?? 10) - delta * ZOOM_SPEED;
  const clampedSize = Math.max(
    MIN_RADIUS / 2,
    Math.min(MAX_RADIUS / 2, newSize),
  );

  const aspectRatio = (camera.orthoRight ?? 16) / (camera.orthoTop ?? 9);
  camera.orthoTop = clampedSize;
  camera.orthoBottom = -clampedSize;
  camera.orthoRight = clampedSize * aspectRatio;
  camera.orthoLeft = -clampedSize * aspectRatio;
}

/**
 * Get bounds visible to the camera (for culling)
 */
export function getCameraVisibleBounds(camera: ArcRotateCamera): {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
} {
  const target = camera.target;
  const size = camera.orthoTop ?? 10;
  const aspectRatio = (camera.orthoRight ?? 16) / (camera.orthoTop ?? 9);

  return {
    minX: target.x - size * aspectRatio,
    maxX: target.x + size * aspectRatio,
    minZ: target.z - size,
    maxZ: target.z + size,
  };
}

/**
 * Cubic ease out function
 */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

// Re-export types
export { ArcRotateCamera, Vector3 };
