# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [EXAMPLE.md](file://EXAMPLE.md)
- [package.json](file://projects/ngx-hotkeys/package.json)
- [hotkeys.service.ts](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts)
- [inject-hotkeys.ts](file://projects/ngx-hotkeys/src/lib/inject-hotkeys.ts)
- [parser.ts](file://projects/ngx-hotkeys/src/lib/parser.ts)
- [types.ts](file://projects/ngx-hotkeys/src/lib/types.ts)
- [public-api.ts](file://projects/ngx-hotkeys/src/lib/public-api.ts)
- [app.component.ts](file://projects/demo-app/src/app/app.component.ts)
- [main.ts](file://projects/demo-app/src/main.ts)
- [angular.json](file://angular.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [Initial Configuration](#initial-configuration)
5. [Fundamental Usage](#fundamental-usage)
6. [One-Line Registration Pattern](#one-line-registration-pattern)
7. [Manual Unregistration](#manual-unregistration)
8. [Auto-Cleanup Behavior](#auto-cleanup-behavior)
9. [Basic HotkeyOptions Configuration](#basic-hotkeyoptions-configuration)
10. [Angular Integration and Dependency Injection](#angular-integration-and-dependency-injection)
11. [Supported Shortcuts](#supported-shortcuts)
12. [Troubleshooting](#troubleshooting)
13. [Next Steps](#next-steps)

## Introduction
ngx-hotkeys is a lightweight, Angular-native keyboard shortcut library designed for zero-boilerplate usage. It integrates seamlessly with Angular's dependency injection system and provides a simple one-line registration pattern for keyboard shortcuts.

## Installation
Install ngx-hotkeys using npm:

```bash
npm install ngx-hotkeys
```

**Section sources**
- [README.md:9-13](file://README.md#L9-L13)

## Basic Setup
The library requires Angular 17.0.0 or higher. No additional setup is required beyond installing the package.

**Section sources**
- [package.json:22-25](file://projects/ngx-hotkeys/package.json#L22-L25)

## Initial Configuration
There is no special configuration required. The library works out-of-the-box with Angular's dependency injection system.

## Fundamental Usage
The simplest way to use ngx-hotkeys is to import the injectHotkeys function and use it within a component constructor or field initializer.

```typescript
import { Component } from '@angular/core';
import { injectHotkeys } from 'ngx-hotkeys';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>Press mod+k</h1>`,
})
export class AppComponent {
  private hotkeys = injectHotkeys();

  constructor() {
    this.hotkeys.on('mod+k', () => console.log('Open search'));
  }
}
```

**Section sources**
- [README.md:17-43](file://README.md#L17-L43)
- [inject-hotkeys.ts:4-6](file://projects/ngx-hotkeys/src/lib/inject-hotkeys.ts#L4-L6)

## One-Line Registration Pattern
The library provides a clean one-line registration pattern for keyboard shortcuts. Here are practical examples:

### Basic shortcuts
- `mod+k`: Opens search (Cmd on Mac, Ctrl on Windows/Linux)
- `esc`: Closes modal
- `j`: Increments counter
- `shift+enter`: Special action

### Advanced example with preventDefault
```typescript
this.hotkeys.on('mod+s', (e) => this.save(), { preventDefault: true });
```

**Section sources**
- [README.md:17-43](file://README.md#L17-L43)
- [app.component.ts:18-41](file://projects/demo-app/src/app/app.component.ts#L18-L41)

## Manual Unregistration
Each registration returns an `off` function that removes the listener. This allows for manual cleanup when needed.

```typescript
const off = this.hotkeys.on('j', () => nextRow());
off(); // remove listener
```

**Section sources**
- [README.md:45-50](file://README.md#L45-L50)
- [hotkeys.service.ts:36-60](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L36-L60)

## Auto-Cleanup Behavior
When used inside components or services, listeners automatically unregister on destruction, preventing memory leaks.

**Section sources**
- [README.md:52-54](file://README.md#L52-L54)
- [hotkeys.service.ts:26-34](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L26-L34)

## Basic HotkeyOptions Configuration
The HotkeyOptions interface provides two key configuration options:

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| preventDefault | boolean | Calls `event.preventDefault()` when true | false |
| allowInInput | boolean | Triggers even when typing in inputs | false |

Examples:
```typescript
// Prevent browser save dialog
this.hotkeys.on('mod+s', () => this.save(), { preventDefault: true });

// Global shortcuts that work in inputs
this.hotkeys.on('mod+enter', () => this.submit(), { allowInInput: true });
```

**Section sources**
- [types.ts:1-4](file://projects/ngx-hotkeys/src/lib/types.ts#L1-L4)
- [README.md:74-81](file://README.md#L74-L81)
- [EXAMPLE.md:72-76](file://EXAMPLE.md#L72-L76)

## Angular Integration and Dependency Injection
ngx-hotkeys integrates with Angular's DI system through the `injectHotkeys` function, which returns a singleton `HotkeysService` instance.

### Where to use injectHotkeys
- Constructor parameters
- Component field initializers
- Services with `providedIn: 'root'`
- Any Angular injection context

### Example in a service
```typescript
import { Injectable } from '@angular/core';
import { injectHotkeys } from 'ngx-hotkeys';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private hotkeys = injectHotkeys();

  constructor() {
    this.hotkeys.on('j', () => this.next());
    this.hotkeys.on('k', () => this.prev());
  }
}
```

**Section sources**
- [inject-hotkeys.ts:4-6](file://projects/ngx-hotkeys/src/lib/inject-hotkeys.ts#L4-L6)
- [EXAMPLE.md:45-69](file://EXAMPLE.md#L45-L69)

## Supported Shortcuts
The library supports common keyboard shortcuts with automatic platform detection:

| Shortcut | Description |
|----------|-------------|
| `mod+k` | Cmd on Mac, Ctrl on Windows/Linux |
| `mod+s` | Same as above |
| `esc` | Escape |
| `enter` | Enter / Return |
| `shift+enter` | Shift + Enter |
| `alt+1` | Alt + 1 |
| `arrowup` | Up arrow |
| `arrowdown` | Down arrow |
| `arrowleft` | Left arrow |
| `arrowright` | Right arrow |

**Section sources**
- [README.md:85-101](file://README.md#L85-L101)

## Troubleshooting
### Common Issues and Solutions

**Issue**: Hotkeys not working in inputs
- **Solution**: Use `{ allowInInput: true }` option
- **Example**: `this.hotkeys.on('mod+enter', () => this.submit(), { allowInInput: true });`

**Issue**: Browser default actions interfering
- **Solution**: Use `{ preventDefault: true }` option
- **Example**: `this.hotkeys.on('mod+s', () => this.save(), { preventDefault: true });`

**Issue**: Memory leaks in long-running applications
- **Solution**: The library automatically cleans up on component/service destruction
- **Manual cleanup**: Call the returned `off()` function when needed

**Section sources**
- [hotkeys.service.ts:62-76](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L62-L76)
- [hotkeys.service.ts:100-112](file://projects/ngx-hotkeys/src/lib/hotkeys.service.ts#L100-L112)

## Next Steps
1. Start with the basic component example from the README
2. Experiment with different shortcut combinations
3. Explore advanced options like `preventDefault` and `allowInInput`
4. Integrate into your existing Angular application components
5. Consider using the library in services for global shortcuts

**Section sources**
- [README.md:17-43](file://README.md#L17-L43)
- [EXAMPLE.md:1-77](file://EXAMPLE.md#L1-L77)