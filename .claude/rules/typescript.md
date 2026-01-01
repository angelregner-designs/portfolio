# TypeScript & Code Style

## General Style
- Loosely prefer FP over OOP. Prefer the following unless it sacrifices clarity and simplicity.
  - immutable data and pure functions
  - function composition
  - declarative code vs imperative code
- arrow functions over function declarations
- Implicit returns where possible
- No semicolons
- Comment non-obvious lines or lines of code for clarity

## TypeScript
- Strict mode enabled
- Avoid `any` - use `unknown` or proper types
- Prefer `type` for object shapes, unions, aliases
- Use type annotations from libraries when passing objects to their functions/components

## Architecture
- Keep components small, single-responsibility
