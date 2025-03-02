# CLAUDE.md - Development Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks

## Code Style Guidelines
- **TypeScript**: Use strict typing with interfaces for data structures
- **Classes**: Use private modifiers for internal properties
- **Methods**: Document with JSDoc comments for public APIs
- **Component Props**: Define with descriptive types and defaults
- **Imports**: Group by external, then internal, alphabetical order
- **Naming**: camelCase for variables/methods, PascalCase for classes/components
- **CSS**: Component-scoped styles with descriptive class names
- **Error Handling**: Use early returns and type guards
- **State Management**: Use class instances for complex state
- **Svelte Syntax**: Use $props(), $effect() for reactivity
- **Event Handling**: Dispatch custom events with typed payloads

Aim for clean, readable code with consistent formatting.