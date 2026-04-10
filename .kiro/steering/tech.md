# Technology Stack

## Core Technologies

- **Framework**: React Native + Expo SDK 54
- **3D Engine**: BabylonJS + Reactylon
- **State Management**: Miniplex ECS + Zustand
- **Navigation/AI**: BabylonJS Navigation Plugin V2 (RecastJS)
- **Build Tool**: Vite + EAS Build
- **Package Manager**: pnpm with workspace support

## Code Quality & Tooling

- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Testing**: Vitest + React Testing Library
- **Type Checking**: TypeScript 5.9 (strict mode)
- **E2E Testing**: Maestro for mobile flows

## Asset Pipeline

- **3D Models**: Meshy AI text-to-3D + Blender cleanup
- **Format**: GLB with embedded textures
- **Audio**: Web Audio API with preloading

## Common Commands

### Development

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Code Quality

```bash
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome
pnpm check            # TypeScript type checking
pnpm test             # Run tests
pnpm test:coverage    # Run tests with coverage
```

### Mobile

```bash
pnpm --filter @cosmic-cults/mobile dev     # Start Expo dev server
pnpm --filter @cosmic-cults/mobile build   # Build with EAS
```

## Architecture Notes

- Monorepo structure with apps/mobile, apps/web, and packages/
- ECS for game entities, Zustand for UI state
- Game logic portable between mobile and web builds
- Asset lazy-loading for performance
- Offline-first design for save system
