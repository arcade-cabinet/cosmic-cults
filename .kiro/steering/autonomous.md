# Autonomous Agent Guidelines

## Before Taking Action

1. **Check the spec** - Read `.kiro/specs/1.0-migration/tasks.md` for current priorities
2. **Check active context** - Read `memory-bank/activeContext.md` if it exists
3. **Verify dependencies** - Ensure prerequisite tasks are complete

## During Implementation

1. **Follow the task checklist** - Each task file has detailed subtasks
2. **Write tests first** - Property-based tests for game logic
3. **Verify after each change** - Run `pnpm check && pnpm test && pnpm lint`
4. **Commit frequently** - Small, focused commits with conventional messages

## Quality Gates

Before marking a task complete:
- [ ] All subtask checkboxes marked
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Linting passes
- [ ] Manual verification in app

## Error Recovery

If you encounter:

- **Build errors**: Check imports and TypeScript types
- **Runtime errors**: Check BabylonJS lifecycle and React hooks
- **Test failures**: Verify test setup and mocks
- **Performance issues**: Profile with BabylonJS Inspector

## Communication

- Update `memory-bank/activeContext.md` at end of session
- Comment on relevant GitHub issues with progress
- Create new issues for discovered bugs or blockers

## Boundaries

**DO:**
- Complete tasks in dependency order
- Add comprehensive tests
- Document non-obvious code

**DON'T:**
- Skip to later tasks before foundations complete
- Leave TODO comments without tracking issues
- Merge with failing tests
