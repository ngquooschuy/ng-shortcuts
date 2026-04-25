# injectHotkeys Function

<cite>
**Referenced Files in This Document**
- [inject-hotkeys.ts](file://projects/ngx-hotkeys/src/lib/inject-hotkeys.ts)
- [hotkeys.service.ts](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts)
- [public-api.ts](file://projects/ngx-hotkeys/src/lib/public-api.ts)
- [types.ts](file://projects/ngx-hotkeys/src/lib/types.ts)
- [README.md](file://README.md)
- [EXAMPLE.md](file://EXAMPLE.md)
- [app.component.ts](file://projects/demo-app/src/app/app.component.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Function Signature and Purpose](#function-signature-and-purpose)
3. [Implementation Details](#implementation-details)
4. [Usage Patterns](#usage-patterns)
5. [Integration with Angular DI](#integration-with-angular-di)
6. [Performance Considerations](#performance-considerations)
7. [Best Practices](#best-practices)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [API Reference](#api-reference)
10. [Conclusion](#conclusion)

## Introduction

The `injectHotkeys()` function is a specialized Angular dependency injection helper designed to provide seamless access to the `HotkeysService` singleton instance. This function serves as a thin wrapper around Angular's built-in `inject()` function, offering developers a clean, type-safe way to access keyboard shortcut functionality throughout their Angular applications.

The function is part of the ngx-hotkeys library, which provides a lightweight, zero-boilerplate solution for implementing keyboard shortcuts in Angular applications. It eliminates the need for manual service injection while maintaining full integration with Angular's dependency injection system.

## Function Signature and Purpose

### Function Definition
```typescript
export function injectHotkeys(): HotkeysService
```

### Purpose
The primary purpose of `injectHotkeys()` is to serve as a convenience function that:
- Provides access to the singleton `HotkeysService` instance
- Ensures proper dependency injection within Angular's injection context
- Returns a strongly-typed `HotkeysService` object ready for immediate use
- Maintains consistency with Angular's modern injection patterns

### Return Type
The function returns a `HotkeysService` instance, which is the core service responsible for managing keyboard shortcuts in the application.

**Section sources**
- [inject-hotkeys.ts:4-6](file://projects/ngx-hotkeys/src/lib/inject-hotkeys.ts#L4-L6)

## Implementation Details

### Core Implementation
The `injectHotkeys()` function is implemented as a minimal wrapper around Angular's `inject()` function:

```typescript
import { inject } from '@angular/core';
import { HotkeysService } from './hotkeys.service';

export function injectHotkeys(): HotkeysService {
  return inject(HotkeysService);
}
```

### Injection Context Requirements
The function requires execution within an Angular injection context, which includes:
- Component constructors
- Component field initializers
- Service constructors
- Functions wrapped with `runInInjectionContext()`

### Relationship with HotkeysService
The `HotkeysService` is decorated with `@Injectable({ providedIn: 'root' })`, making it a singleton service that:
- Automatically registers keyboard event listeners during construction
- Manages cleanup through Angular's `DestroyRef` mechanism
- Provides automatic memory leak prevention

**Section sources**
- [inject-hotkeys.ts:1-6](file://projects/ngx-hotkeys/src/lib/inject-hotkeys.ts#L1-L6)
- [hotkeys.service.ts:18](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L18)

## Usage Patterns

### Pattern 1: Direct Assignment in Constructor
The most common usage pattern involves direct assignment within component constructors:

```typescript
constructor() {
  this.hotkeys = injectHotkeys();
  this.hotkeys.on('mod+k', () => console.log('Open search'));
}
```

### Pattern 2: Property Injection with Private Fields
Using TypeScript's property initializer syntax for cleaner code:

```typescript
private hotkeys = injectHotkeys();

constructor() {
  this.hotkeys.on('esc', () => console.log('Close modal'));
}
```

### Pattern 3: Service Consumption
Using the function within services for global keyboard shortcuts:

```typescript
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private hotkeys = injectHotkeys();

  constructor() {
    this.hotkeys.on('j', () => this.next());
    this.hotkeys.on('k', () => this.prev());
  }
}
```

### Pattern 4: Standalone Functions
Using the function within standalone components or functions:

```typescript
@Component({
  selector: 'app-search',
  standalone: true,
  template: '<div>Search component</div>'
})
export class SearchComponent {
  private hotkeys = injectHotkeys();
  
  constructor() {
    this.hotkeys.on('mod+k', () => this.openSearch());
  }
}
```

**Section sources**
- [README.md:19-43](file://README.md#L19-L43)
- [EXAMPLE.md:3-43](file://EXAMPLE.md#L3-L43)
- [EXAMPLE.md:45-70](file://EXAMPLE.md#L45-L70)
- [app.component.ts:11-42](file://projects/demo-app/src/app/app.component.ts#L11-L42)

## Integration with Angular DI

### Injection Context Requirements
The `injectHotkeys()` function operates within Angular's dependency injection system and requires execution in a valid injection context:

```typescript
// ✅ Valid contexts
constructor() {
  const hotkeys = injectHotkeys(); // Component constructor
}

export class MyService {
  private hotkeys = injectHotkeys(); // Service constructor
  
  constructor() {
    this.hotkeys.on('esc', () => {}); // Service constructor
  }
}

// ❌ Invalid contexts
function someFunction() {
  const hotkeys = injectHotkeys(); // Not in injection context
}
```

### Singleton Behavior
The underlying `HotkeysService` is registered as a singleton (`providedIn: 'root'`), ensuring:
- Single instance shared across the entire application
- Consistent keyboard event handling
- Efficient memory usage
- Automatic cleanup on application destruction

### DestroyRef Integration
The service integrates with Angular's `DestroyRef` to automatically clean up event listeners:

```typescript
constructor() {
  // Event listeners automatically removed on component/service destruction
  this.hotkeys.on('mod+k', () => console.log('Cleanup handled automatically'));
}
```

**Section sources**
- [hotkeys.service.ts:18](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L18)
- [hotkeys.service.ts:22](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L22)
- [hotkeys.service.ts:30-33](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L30-L33)

## Performance Considerations

### Memory Management
The `HotkeysService` automatically manages memory through Angular's lifecycle hooks:
- Event listeners are registered during construction
- Cleanup occurs automatically when components/services are destroyed
- No manual cleanup required from developer code

### Event Handler Efficiency
Keyboard event handling is optimized through:
- Efficient event listener registration and removal
- Minimal DOM manipulation
- Smart filtering of input focus scenarios
- Platform-aware modifier key detection

### Lazy Loading Benefits
Using the injection helper enables:
- On-demand service instantiation
- Reduced bundle size when not used
- Proper tree-shaking support

### Best Practices for Performance
- Register hotkeys during component initialization
- Remove unnecessary listeners promptly
- Use appropriate `preventDefault` options judiciously
- Consider `allowInInput` option for global shortcuts

**Section sources**
- [hotkeys.service.ts:26-34](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L26-L34)
- [hotkeys.service.ts:58](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L58)

## Best Practices

### When to Call injectHotkeys()
Call the function in these optimal scenarios:
- Component constructors for component-specific shortcuts
- Service constructors for application-wide shortcuts
- Field initializers for immediate availability
- Within Angular lifecycle hooks (OnInit, AfterViewInit)

### Code Organization
Structure your code for maintainability:
- Group related hotkeys in the same location
- Use meaningful shortcut names
- Document complex shortcut combinations
- Consider extracting common shortcuts to shared services

### Error Prevention
Common pitfalls to avoid:
- Calling outside injection context
- Creating multiple instances unintentionally
- Forgetting to handle cleanup in long-lived components
- Overusing preventDefault globally

### Testing Considerations
When testing components using hotkeys:
- Mock the `HotkeysService` for controlled testing
- Test shortcut registration and removal
- Verify event handler execution
- Ensure proper cleanup in component teardown

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue: "No provider for HotkeysService"
**Cause**: Using `injectHotkeys()` outside of Angular's injection context
**Solution**: Ensure the function is called within a component constructor, service constructor, or another valid injection context

#### Issue: Hotkeys not working in inputs
**Cause**: Default behavior prevents shortcuts in form inputs
**Solution**: Use the `allowInInput` option when registering hotkeys that should work in text inputs

#### Issue: Memory leaks or duplicate listeners
**Cause**: Manual event listener management or improper cleanup
**Solution**: Rely on the automatic cleanup provided by the service; avoid manual DOM manipulation

#### Issue: Hotkeys firing unexpectedly
**Cause**: Modifier key combinations not matching expected platform behavior
**Solution**: Use the `mod` shorthand which automatically maps to platform-appropriate keys

### Debugging Tips
- Verify injection context by checking the call location
- Use browser developer tools to inspect event listeners
- Test shortcuts in isolation to identify conflicts
- Check for conflicting browser extensions or OS shortcuts

### Platform-Specific Considerations
- macOS vs Windows/Linux modifier key differences are handled automatically
- Ensure cross-platform testing for modifier key combinations
- Consider accessibility implications of shortcut choices

**Section sources**
- [README.md:52-54](file://README.md#L52-L54)
- [types.ts:1-4](file://projects/ngx-hotkeys/src/lib/types.ts#L1-L4)

## API Reference

### injectHotkeys Function
- **Signature**: `injectHotkeys(): HotkeysService`
- **Purpose**: Returns the singleton `HotkeysService` instance
- **Injection Context**: Required (component constructor, service constructor, etc.)
- **Return Type**: `HotkeysService`

### HotkeysService Methods
- `on(shortcut: string, handler: HotkeyHandler, options?: HotkeyOptions): () => void`
  - Registers a new keyboard shortcut
  - Returns an `off` function to remove the listener
- `destroyRef.onDestroy(callback: () => void): void`
  - Internal cleanup mechanism for automatic resource management

### HotkeyOptions Interface
```typescript
interface HotkeyOptions {
  preventDefault?: boolean; // Calls event.preventDefault() on match
  allowInInput?: boolean;   // Triggers even when typing in inputs
}
```

### Supported Shortcuts
- `mod+k` - Platform-appropriate modifier key (Cmd on macOS, Ctrl on others)
- `esc` - Escape key
- `enter` - Enter/Return key
- `shift+enter` - Combined modifier and key
- `alt+1` - Alt plus digit
- Arrow keys: `arrowup`, `arrowdown`, `arrowleft`, `arrowright`

**Section sources**
- [README.md:60-81](file://README.md#L60-L81)
- [types.ts:1-16](file://projects/ngx-hotkeys/src/lib/types.ts#L1-L16)

## Conclusion

The `injectHotkeys()` function provides a streamlined approach to accessing Angular's keyboard shortcut functionality through a clean, type-safe interface. By serving as a thin wrapper around Angular's dependency injection system, it offers several key advantages:

- **Type Safety**: Full TypeScript integration with proper return type inference
- **Convenience**: Eliminates the need for manual service injection boilerplate
- **Consistency**: Aligns with Angular's modern injection patterns
- **Reliability**: Leverages Angular's proven dependency injection infrastructure
- **Automatic Cleanup**: Integrates seamlessly with Angular's lifecycle management

The function exemplifies Angular's design philosophy of providing developer-friendly APIs while maintaining deep integration with the framework's core systems. Its implementation demonstrates how small, focused helpers can significantly improve developer experience without sacrificing functionality or performance.

For optimal results, use `injectHotkeys()` within appropriate injection contexts, leverage the automatic cleanup mechanisms, and follow the established usage patterns demonstrated in the library's examples and documentation.