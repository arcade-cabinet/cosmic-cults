// Procedural Asset Registry
export * from './procedural/UnitMesh';
export * from './procedural/HexMesh';

// No static paths anymore - "assets" are now procedural components
// We could export configurations or seeds here if needed
export const AssetConfig = {
  UnitScale: 1.0,
  HexSize: 1.0
};
