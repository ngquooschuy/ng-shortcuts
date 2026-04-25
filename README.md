# ng-shortcuts

> Keyboard shortcuts for Angular in one line.

A tiny, elegant, Angular-native hotkey library with zero boilerplate.

---

## Install

```bash
npm install ng-shortcuts
```

---

## Usage

### Service API (imperative)

```ts
import { Component } from '@angular/core';
import { injectHotkeys } from 'ng-shortcuts';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>Press mod+k</h1>`,
})
export class AppComponent {
  private hotkeys = injectHotkeys();

  constructor() {
    this.hotkeys.on('mod+k', () => console.log('Open search'));
    this.hotkeys.on('esc', () => console.log('Close modal'));
    this.hotkeys.on('mod+s', (e) => this.save(), { preventDefault: true });
  }

  private save() {
    // save logic
  }
}
```

### Multiple shortcuts

```ts
this.hotkeys.on(['mod+k', '/'], () => this.openSearch());
```

### Conditional shortcuts with `enabled`

```ts
this.hotkeys.on('mod+s', () => this.save(), {
  enabled: () => this.form.valid
});
```

### Unregister manually

```ts
const off = this.hotkeys.on('j', () => nextRow());
off(); // remove listener
```

### Auto cleanup

When used inside a component or service, listeners automatically unregister on destroy. No memory leaks.

---

## Directive API (declarative)

### Basic

```html
<button
  [hotkey]="'mod+s'"
  (hotkeyTriggered)="save()">
  Save
</button>
```

### Multiple shortcuts

```html
<button
  [hotkey]="['mod+k', '/']"
  (hotkeyTriggered)="openSearch()">
  Search
</button>
```

### With options

```html
<div
  [hotkey]="'esc'"
  [hotkeyEnabled]="isOpen"
  [hotkeyPreventDefault]="true"
  (hotkeyTriggered)="close()">
</div>
```

### Directive inputs

| Input | Type | Description |
|-------|------|-------------|
| `hotkey` | `string \| string[]` | **Required.** Shortcut(s) to bind |
| `hotkeyEnabled` | `boolean \| (() => boolean)` | Conditionally enable the shortcut |
| `hotkeyPreventDefault` | `boolean` | Call `event.preventDefault()` |
| `hotkeyAllowInInput` | `boolean` | Allow trigger when typing in inputs |
| `hotkeySequenceTimeout` | `number` | Timeout between sequence steps (ms) |

### Directive output

| Output | Type | Description |
|--------|------|-------------|
| `hotkeyTriggered` | `EventEmitter<KeyboardEvent>` | Fires when the shortcut matches |

---

## API

### `injectHotkeys()`

Returns `HotkeysService`. Call inside an injection context (constructor, component field, or `runInInjectionContext`).

### `HotkeysService.on(shortcut, handler, options?)`

| Param | Type | Description |
|-------|------|-------------|
| shortcut | `string \| string[]` | e.g. `'mod+k'`, `'esc'`, `['mod+k', '/']` |
| handler | `(event: KeyboardEvent) => void` | Callback fired on match |
| options | `HotkeyOptions` | Optional settings |

Returns an `off` function that removes the listener.

### `HotkeyOptions`

```ts
interface HotkeyOptions {
  preventDefault?: boolean;  // call event.preventDefault()
  allowInInput?: boolean;    // trigger even when typing in inputs
  enabled?: boolean | (() => boolean); // conditionally enable
  sequenceTimeout?: number;  // timeout between sequence steps (ms)
}
```

---

## Supported shortcuts

| Shortcut | Description |
|----------|-------------|
| `mod+k` | Cmd on Mac, Ctrl on Win/Linux |
| `mod+s` | Same as above |
| `esc` | Escape |
| `enter` | Enter / Return |
| `shift+enter` | Shift + Enter |
| `alt+1` | Alt + 1 |
| `arrowup` | Up arrow |
| `arrowdown` | Down arrow |
| `arrowleft` | Left arrow |
| `arrowright` | Right arrow |

`mod` automatically maps to `meta` on macOS and `ctrl` on Windows/Linux.

---

## Gmail-style sequences (v1.2)

```ts
hotkeys.on('g h', goHome);
hotkeys.on('g d', openDashboard);
hotkeys.on('up up down down', unlockMode);

hotkeys.on('g i', openInbox, {
  sequenceTimeout: 1200
});
```

Space-separated tokens become a sequence. Press each key in order within the timeout (default 1000ms).

### Directive sequences

```html
<button
  [hotkey]="'g h'"
  (hotkeyTriggered)="goHome()">
</button>
```

---

## Display shortcuts beautifully (v1.3)

### `formatShortcut()`

Format any shortcut for display. Automatically shows Mac or Windows/Linux symbols.

```ts
import { formatShortcut } from 'ng-shortcuts';

formatShortcut('mod+k');   // Mac: ⌘K  Win: Ctrl+K
formatShortcut('shift+enter'); // Mac: ⇧↵  Win: Shift+Enter
formatShortcut('g h');     // G H
```

Via the service:

```ts
const hotkeys = injectHotkeys();
hotkeys.format('mod+k'); // ⌘K or Ctrl+K
```

### Badge component

```html
<button>
  Search
  <ngx-hotkey-badge keys="mod+k" />
</button>
```

Renders a compact keyboard-key badge with the correct symbols for the user's platform.

### Cheat sheet component

**Manual items:**

```html
<ngx-hotkeys-cheatsheet
  title="Keyboard Shortcuts"
  [items]="[
    { keys: 'mod+k', label: 'Search' },
    { keys: 'mod+s', label: 'Save' },
    { keys: 'g h', label: 'Go Home' }
  ]">
</ngx-hotkeys-cheatsheet>
```

**Auto-populated from registered shortcuts:**

```ts
this.hotkeys.on('mod+k', () => this.openSearch(), { description: 'Search' });
this.hotkeys.on('mod+s', () => this.save(), { description: 'Save' });
```

```html
<ngx-hotkeys-cheatsheet />
```

The cheatsheet automatically reads shortcuts that were registered with a `description`.

---

## Migration from v1.2 to v1.3

### New in v1.3

1. **`formatShortcut()`** — platform-aware shortcut formatting
2. **`<ngx-hotkey-badge>`** — standalone badge component
3. **`<ngx-hotkeys-cheatsheet>`** — standalone cheat sheet component
4. **`description` option** — attach labels to shortcuts for auto cheatsheets

### Breaking changes

None. v1.3 is fully backward compatible.

---

## Migration from v1.1 to v1.2

### New in v1.2

1. **Key sequences** — `hotkeys.on('g h', handler)`
2. **`sequenceTimeout` option** — customize sequence timeout per binding
3. **`[hotkeySequenceTimeout]`** directive input

### Breaking changes

None. v1.2 is fully backward compatible.

---

## Migration from v1 to v1.1

### New in v1.1

1. **Directive API** — bind shortcuts directly in templates with `[hotkey]`
2. **Multiple shortcuts** — pass an array: `['mod+k', '/']`
3. **Enabled option** — dynamically enable/disable shortcuts

### Breaking changes

None. v1.1 is fully backward compatible.

---

## Build & Publish

### Build

```bash
npm install
npm run build:prod
```

The compiled library lands in `dist/ngx-hotkeys/`.

### Publish

```bash
cd dist/ngx-hotkeys
npm publish --access public
```

---

## License

MIT
