# ng-shortcuts

> Tiny Angular keyboard shortcuts library with zero boilerplate.

## Install

```bash
npm install ng-shortcuts
```

## Quick Start

```ts
import { Component } from '@angular/core';
import { injectHotkeys } from 'ng-shortcuts';

@Component({
  standalone: true,
  template: `<h1>Press mod+k</h1>`,
})
export class AppComponent {
  hotkeys = injectHotkeys();

  constructor() {
    this.hotkeys.on('mod+k', () => this.openSearch());
    this.hotkeys.on('mod+s', () => this.save(), {
      preventDefault: true,
      description: 'Save'
    });
  }
}
```

## Directive API

```html
<button [hotkey]="'mod+s'" (hotkeyTriggered)="save()">
  Save
</button>
```

## Sequences

```ts
hotkeys.on('g h', goHome);
hotkeys.on('g d', openDashboard);
```

## Display Shortcuts

```ts
import { formatShortcut } from 'ng-shortcuts';
formatShortcut('mod+k');
```

```html
<ngx-hotkey-badge keys="mod+k" />
<ngx-hotkeys-cheatsheet />
```

## API

```ts
hotkeys.on('mod+s', save, {
  preventDefault: true,
  allowInInput: false,
  enabled: true,
  sequenceTimeout: 1000,
  description: 'Save'
});
```

Returns `off()` cleanup function.

## Supported Keys

* `mod+k`
* `mod+s`
* `esc`
* `enter`
* `shift+enter`
* `alt+1`
* `arrowup`

`mod` = `⌘` on Mac, `Ctrl` on Windows/Linux.

## Build

```bash
npm run build:prod
```

Output: `dist/ng-shortcuts/`

## License

MIT
