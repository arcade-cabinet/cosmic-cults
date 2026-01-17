/**
 * BabylonJS GUI system for Cosmic Cults
 *
 * JRPG-style HUD overlay using AdvancedDynamicTexture
 * Replaces traditional React UI for better 3D integration
 */

import type { Scene } from '@babylonjs/core';
import {
  AdvancedDynamicTexture,
  Button,
  Control,
  Grid,
  Rectangle,
  StackPanel,
  TextBlock,
} from '@babylonjs/gui';
import type { FactionId, Health, UnitType } from '@cosmic-cults/types';
import { FACTION_COLORS } from '@cosmic-cults/types';

// GUI singleton
let guiTexture: AdvancedDynamicTexture | null = null;

// UI containers
let topBar: Rectangle | null = null;
let bottomPanel: Rectangle | null = null;
let unitPanel: Rectangle | null = null;
let minimapContainer: Rectangle | null = null;
let actionBar: StackPanel | null = null;

/**
 * Initialize the GUI system
 */
export function initializeGUI(scene: Scene): AdvancedDynamicTexture {
  if (guiTexture) {
    return guiTexture;
  }

  guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
  guiTexture.idealHeight = 1080;

  createTopBar();
  createBottomPanel();
  createMinimapContainer();

  return guiTexture;
}

/**
 * Get the GUI texture
 */
export function getGUITexture(): AdvancedDynamicTexture | null {
  return guiTexture;
}

/**
 * Create the top bar (turn info, faction, phase)
 */
function createTopBar(): void {
  if (!guiTexture) return;

  topBar = new Rectangle('topBar');
  topBar.width = '100%';
  topBar.height = '60px';
  topBar.thickness = 0;
  topBar.background = 'rgba(10, 10, 18, 0.85)';
  topBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  guiTexture.addControl(topBar);

  const grid = new Grid();
  grid.addColumnDefinition(0.3);
  grid.addColumnDefinition(0.4);
  grid.addColumnDefinition(0.3);
  topBar.addControl(grid);

  // Turn counter
  const turnText = new TextBlock('turnText');
  turnText.text = 'Turn 1';
  turnText.color = 'white';
  turnText.fontSize = 20;
  turnText.fontFamily = 'monospace';
  turnText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  turnText.paddingLeft = '20px';
  grid.addControl(turnText, 0, 0);

  // Faction name (center)
  const factionText = new TextBlock('factionText');
  factionText.text = 'VOID SEEKERS';
  factionText.color = FACTION_COLORS['void-seekers'];
  factionText.fontSize = 24;
  factionText.fontFamily = 'monospace';
  factionText.fontWeight = 'bold';
  grid.addControl(factionText, 0, 1);

  // Phase indicator
  const phaseText = new TextBlock('phaseText');
  phaseText.text = 'Exploration';
  phaseText.color = '#aaa';
  phaseText.fontSize = 18;
  phaseText.fontFamily = 'monospace';
  phaseText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  phaseText.paddingRight = '20px';
  grid.addControl(phaseText, 0, 2);
}

/**
 * Create the bottom panel (unit info, actions)
 */
function createBottomPanel(): void {
  if (!guiTexture) return;

  bottomPanel = new Rectangle('bottomPanel');
  bottomPanel.width = '100%';
  bottomPanel.height = '150px';
  bottomPanel.thickness = 0;
  bottomPanel.background = 'rgba(10, 10, 18, 0.9)';
  bottomPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  guiTexture.addControl(bottomPanel);

  const grid = new Grid();
  grid.addColumnDefinition(0.35);
  grid.addColumnDefinition(0.65);
  bottomPanel.addControl(grid);

  // Unit info panel (left side)
  unitPanel = new Rectangle('unitPanel');
  unitPanel.thickness = 0;
  unitPanel.paddingLeft = '20px';
  unitPanel.paddingTop = '10px';
  grid.addControl(unitPanel, 0, 0);

  // No unit selected by default
  const noUnitText = new TextBlock('noUnitText');
  noUnitText.text = 'No unit selected';
  noUnitText.color = '#666';
  noUnitText.fontSize = 16;
  noUnitText.fontFamily = 'monospace';
  unitPanel.addControl(noUnitText);

  // Action bar (right side)
  actionBar = new StackPanel('actionBar');
  actionBar.isVertical = false;
  actionBar.height = '80px';
  actionBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  actionBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  actionBar.paddingRight = '20px';
  grid.addControl(actionBar, 0, 1);

  // Default action buttons
  createActionButton('Move', '🚶', () => console.log('Move action'));
  createActionButton('Attack', '⚔️', () => console.log('Attack action'));
  createActionButton('Ritual', '🔮', () => console.log('Ritual action'));
  createActionButton('Wait', '⏸️', () => console.log('Wait action'));
}

/**
 * Create an action button
 */
export function createActionButton(
  name: string,
  icon: string,
  onClick: () => void,
): Button {
  if (!actionBar) {
    throw new Error('Action bar not initialized');
  }

  const btn = Button.CreateSimpleButton(`btn-${name}`, '');
  btn.width = '70px';
  btn.height = '70px';
  btn.cornerRadius = 8;
  btn.thickness = 2;
  btn.color = '#666';
  btn.background = 'rgba(30, 30, 40, 0.8)';
  btn.paddingLeft = '5px';
  btn.paddingRight = '5px';

  // Icon
  const iconText = new TextBlock();
  iconText.text = icon;
  iconText.fontSize = 28;
  iconText.paddingBottom = '5px';
  btn.addControl(iconText);

  // Hover effects
  btn.onPointerEnterObservable.add(() => {
    btn.background = 'rgba(60, 60, 80, 0.9)';
    btn.color = '#fff';
  });

  btn.onPointerOutObservable.add(() => {
    btn.background = 'rgba(30, 30, 40, 0.8)';
    btn.color = '#666';
  });

  btn.onPointerClickObservable.add(onClick);

  actionBar.addControl(btn);
  return btn;
}

/**
 * Create minimap container
 */
function createMinimapContainer(): void {
  if (!guiTexture) return;

  minimapContainer = new Rectangle('minimap');
  minimapContainer.width = '200px';
  minimapContainer.height = '200px';
  minimapContainer.thickness = 2;
  minimapContainer.color = '#333';
  minimapContainer.background = 'rgba(10, 10, 18, 0.8)';
  minimapContainer.cornerRadius = 4;
  minimapContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  minimapContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  minimapContainer.top = '70px';
  minimapContainer.left = '-10px';
  guiTexture.addControl(minimapContainer);

  const minimapLabel = new TextBlock();
  minimapLabel.text = 'MINIMAP';
  minimapLabel.color = '#555';
  minimapLabel.fontSize = 14;
  minimapLabel.fontFamily = 'monospace';
  minimapContainer.addControl(minimapLabel);
}

/**
 * Update turn display
 */
export function updateTurnDisplay(turn: number): void {
  if (!guiTexture) return;

  const turnText = guiTexture.getControlByName('turnText') as TextBlock;
  if (turnText) {
    turnText.text = `Turn ${turn}`;
  }
}

/**
 * Update faction display
 */
export function updateFactionDisplay(faction: FactionId): void {
  if (!guiTexture) return;

  const factionText = guiTexture.getControlByName('factionText') as TextBlock;
  if (factionText) {
    const factionName = faction.replace('-', ' ').toUpperCase();
    factionText.text = factionName;
    factionText.color = FACTION_COLORS[faction];
  }
}

/**
 * Update phase display
 */
export function updatePhaseDisplay(phase: string): void {
  if (!guiTexture) return;

  const phaseText = guiTexture.getControlByName('phaseText') as TextBlock;
  if (phaseText) {
    phaseText.text = phase.charAt(0).toUpperCase() + phase.slice(1);
  }
}

/**
 * Show unit info in the unit panel
 */
export function showUnitInfo(
  unitType: UnitType,
  faction: FactionId,
  health: Health,
): void {
  if (!unitPanel) return;

  // Clear existing content
  unitPanel.clearControls();

  const container = new StackPanel();
  container.isVertical = true;
  container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  unitPanel.addControl(container);

  // Unit name
  const nameText = new TextBlock();
  nameText.text = unitType.toUpperCase();
  nameText.color = FACTION_COLORS[faction];
  nameText.fontSize = 20;
  nameText.fontFamily = 'monospace';
  nameText.fontWeight = 'bold';
  nameText.height = '30px';
  nameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  container.addControl(nameText);

  // Health bar container
  const healthContainer = new Rectangle();
  healthContainer.width = '180px';
  healthContainer.height = '20px';
  healthContainer.thickness = 1;
  healthContainer.color = '#444';
  healthContainer.background = '#222';
  healthContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  container.addControl(healthContainer);

  // Health bar fill
  const healthFill = new Rectangle();
  const healthPercent = (health.current / health.max) * 100;
  healthFill.width = `${healthPercent}%`;
  healthFill.height = '100%';
  healthFill.thickness = 0;
  healthFill.background = healthPercent > 50 ? '#4ade80' : healthPercent > 25 ? '#fbbf24' : '#ef4444';
  healthFill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  healthContainer.addControl(healthFill);

  // Health text
  const healthText = new TextBlock();
  healthText.text = `${health.current}/${health.max}`;
  healthText.color = 'white';
  healthText.fontSize = 12;
  healthText.fontFamily = 'monospace';
  healthContainer.addControl(healthText);

  // Faction name
  const factionText = new TextBlock();
  factionText.text = faction.replace('-', ' ');
  factionText.color = '#888';
  factionText.fontSize = 14;
  factionText.fontFamily = 'monospace';
  factionText.height = '25px';
  factionText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  container.addControl(factionText);
}

/**
 * Hide unit info
 */
export function hideUnitInfo(): void {
  if (!unitPanel) return;

  unitPanel.clearControls();

  const noUnitText = new TextBlock('noUnitText');
  noUnitText.text = 'No unit selected';
  noUnitText.color = '#666';
  noUnitText.fontSize = 16;
  noUnitText.fontFamily = 'monospace';
  unitPanel.addControl(noUnitText);
}

/**
 * Show a toast notification
 */
export function showToast(
  message: string,
  duration: number = 3000,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
): void {
  if (!guiTexture) return;

  const colors = {
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const toast = new Rectangle(`toast-${Date.now()}`);
  toast.width = '300px';
  toast.height = '50px';
  toast.thickness = 0;
  toast.background = colors[type];
  toast.cornerRadius = 8;
  toast.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  toast.top = '80px';
  toast.alpha = 0;
  guiTexture.addControl(toast);

  const text = new TextBlock();
  text.text = message;
  text.color = 'white';
  text.fontSize = 16;
  text.fontFamily = 'monospace';
  toast.addControl(text);

  // Fade in
  let alpha = 0;
  const fadeIn = setInterval(() => {
    alpha += 0.1;
    toast.alpha = alpha;
    if (alpha >= 1) {
      clearInterval(fadeIn);
    }
  }, 30);

  // Auto remove
  setTimeout(() => {
    const fadeOut = setInterval(() => {
      alpha -= 0.1;
      toast.alpha = alpha;
      if (alpha <= 0) {
        clearInterval(fadeOut);
        guiTexture?.removeControl(toast);
      }
    }, 30);
  }, duration);
}

/**
 * Create a modal dialog
 */
export function showModal(
  title: string,
  content: string,
  buttons: Array<{ text: string; onClick: () => void }>,
): Rectangle {
  if (!guiTexture) {
    throw new Error('GUI not initialized');
  }

  // Backdrop
  const backdrop = new Rectangle('modalBackdrop');
  backdrop.width = '100%';
  backdrop.height = '100%';
  backdrop.thickness = 0;
  backdrop.background = 'rgba(0, 0, 0, 0.7)';
  guiTexture.addControl(backdrop);

  // Modal container
  const modal = new Rectangle('modal');
  modal.width = '400px';
  modal.height = '250px';
  modal.thickness = 2;
  modal.color = '#444';
  modal.background = 'rgba(20, 20, 30, 0.95)';
  modal.cornerRadius = 12;
  backdrop.addControl(modal);

  const container = new StackPanel();
  container.isVertical = true;
  container.paddingTop = '20px';
  modal.addControl(container);

  // Title
  const titleText = new TextBlock();
  titleText.text = title;
  titleText.color = 'white';
  titleText.fontSize = 22;
  titleText.fontFamily = 'monospace';
  titleText.fontWeight = 'bold';
  titleText.height = '40px';
  container.addControl(titleText);

  // Content
  const contentText = new TextBlock();
  contentText.text = content;
  contentText.color = '#aaa';
  contentText.fontSize = 16;
  contentText.fontFamily = 'monospace';
  contentText.height = '80px';
  contentText.textWrapping = true;
  contentText.paddingLeft = '20px';
  contentText.paddingRight = '20px';
  container.addControl(contentText);

  // Button container
  const buttonContainer = new StackPanel();
  buttonContainer.isVertical = false;
  buttonContainer.height = '60px';
  container.addControl(buttonContainer);

  // Create buttons
  for (const btn of buttons) {
    const button = Button.CreateSimpleButton(`modal-btn-${btn.text}`, btn.text);
    button.width = '100px';
    button.height = '40px';
    button.cornerRadius = 6;
    button.thickness = 1;
    button.color = '#888';
    button.background = 'rgba(50, 50, 70, 0.8)';
    button.paddingLeft = '10px';
    button.paddingRight = '10px';

    button.onPointerClickObservable.add(() => {
      btn.onClick();
      guiTexture?.removeControl(backdrop);
    });

    buttonContainer.addControl(button);
  }

  return backdrop;
}

/**
 * Dispose of GUI resources
 */
export function disposeGUI(): void {
  if (guiTexture) {
    guiTexture.dispose();
    guiTexture = null;
  }
  topBar = null;
  bottomPanel = null;
  unitPanel = null;
  minimapContainer = null;
  actionBar = null;
}
