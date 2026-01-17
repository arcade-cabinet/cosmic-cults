# AI Agent Documentation & Governance

**CRITICAL UPDATE (Jan 2026): Migration to React Native + BabylonJS Active**

The project is transitioning from Rust/Bevy to React Native with BabylonJS (Reactylon). All agents MUST follow the documentation hierarchy below and work from the new specifications.

## Documentation Hierarchy (Golden Record)

1. **START HERE**: [`.kiro/specs/1.0-migration/tasks.md`](.kiro/specs/1.0-migration/tasks.md) - Current task priorities
2. **REQUIREMENTS**: [`.kiro/specs/1.0-migration/requirements.md`](.kiro/specs/1.0-migration/requirements.md) - Acceptance criteria
3. **DESIGN**: [`.kiro/specs/1.0-migration/design.md`](.kiro/specs/1.0-migration/design.md) - Architecture decisions
4. **TECH STACK**: [`.kiro/steering/tech.md`](.kiro/steering/tech.md) - Commands and patterns

## Agent Types

| Agent | Best For | Context File |
|-------|----------|--------------|
| **Claude** | Complex reasoning, architecture, cross-repo work | `CLAUDE.md` |
| **Copilot** | Issue kickoffs, targeted fixes, code generation | `.github/copilot-instructions.md` |
| **Cursor** | IDE-integrated development | `.cursor/rules/*.mdc` |
| **Kiro** | Autonomous spec execution | `.kiro/` directory |

## Current Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React Native + Expo SDK 54 |
| **3D Engine** | BabylonJS + Reactylon |
| **State** | Miniplex ECS + Zustand |
| **AI/Navigation** | Navigation Plugin V2 (RecastJS) |
| **Build** | Vite + EAS Build |
| **Testing** | Vitest + Maestro |

## Before Starting Any Task

### 1. Check Migration Status
```bash
# Current spec and task status
cat .kiro/specs/1.0-migration/tasks.md

# Active context
cat memory-bank/activeContext.md 2>/dev/null || echo "No active context"
```

### 2. Understand Dependencies
- Check task dependency graph in `tasks.md`
- Ensure prerequisite tasks are complete
- Don't skip foundational work

### 3. Verify Environment
```bash
# Node and pnpm versions
node --version  # Should be 22+
pnpm --version  # Should be 10+

# Install dependencies
pnpm install
```

## Development Commands

### Testing
```bash
pnpm test           # Run all tests
pnpm test:coverage  # Run with coverage
```

### Linting
```bash
pnpm lint           # Run Biome linter
pnpm format         # Auto-fix formatting
pnpm check          # TypeScript type check
```

### Building
```bash
pnpm build                              # Build all
pnpm --filter @cosmic-cults/mobile dev  # Mobile dev server
pnpm --filter @cosmic-cults/web dev     # Web dev server
```

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```bash
feat(babylon): add isometric camera component
fix(ecs): correct entity disposal order
docs: update migration progress in tasks.md
test(hex-grid): add property tests for coordinate conversion
```

## Error Recovery

### Build Errors
1. Check TypeScript types: `pnpm check`
2. Check imports are correct for BabylonJS
3. Verify Reactylon component structure

### Test Failures
1. Check if test mocks are setup correctly
2. Verify ECS world initialization
3. Check for async timing issues

### Mobile Issues
1. Clear Metro bundler cache: `pnpm --filter @cosmic-cults/mobile clean`
2. Rebuild native code: `npx expo run:android`
3. Check Expo SDK compatibility

## Memory Bank Protocol

### Reading Context
```bash
cat memory-bank/activeContext.md
```

### Updating Context
```bash
cat >> memory-bank/activeContext.md << 'EOF'

## Session: $(date +%Y-%m-%d)

### Completed
- [x] Description of completed work

### For Next Agent
- [ ] Remaining tasks
EOF
```

## Critical Rules

- Do NOT work on Rust/Bevy code - it's being deprecated
- Do follow the task dependency graph strictly
- Do write property-based tests for game logic
- Do verify 60 FPS on mobile after each major feature
- Do NOT skip to later tasks before foundations complete
- Do update task checkboxes as you complete work

## Legacy Reference

The original Rust/Bevy code remains in the repository for reference during migration. Key design documents:
- `docs/pathfinding.md` - Original pathfinding design
- `docs/SAVE_LOAD.md` - Save system design
- `game-ai/README.md` - AI system concepts

These should inform the React Native implementation but not constrain it.

## Repository-Specific Notes

### Arcade Cabinet Ecosystem
This project is part of the arcade-cabinet organization. Related projects:
- `wheres-ball-though` - Reference for React Native + Expo patterns
- `neo-tokyo-rival-academies` - Reference for BabylonJS + Reactylon patterns

### Meshy AI Assets
Use Meshy AI for procedural 3D asset generation:
- Consistent prompts for Lovecraftian aesthetic
- GLB export with embedded textures
- Post-process in Blender for rigging if needed
