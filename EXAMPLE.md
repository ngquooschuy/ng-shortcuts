# Example Angular Usage

## Standalone component

```ts
import { Component } from '@angular/core';
import { injectHotkeys } from 'ngx-hotkeys';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <div class="overlay" *ngIf="open">
      <input placeholder="Search..." autofocus />
    </div>
  `,
})
export class SearchComponent {
  private hotkeys = injectHotkeys();
  open = false;

  constructor() {
    // Open search with mod+k
    this.hotkeys.on('mod+k', () => {
      this.open = true;
    });

    // Close with esc
    this.hotkeys.on('esc', () => {
      this.open = false;
    });

    // Save with mod+s (prevent browser save dialog)
    this.hotkeys.on('mod+s', (e) => {
      this.performSave();
    }, { preventDefault: true });
  }

  private performSave() {
    console.log('Saving...');
  }
}
```

## Inside a service

```ts
import { Injectable } from '@angular/core';
import { injectHotkeys } from 'ngx-hotkeys';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private hotkeys = injectHotkeys();

  constructor() {
    this.hotkeys.on('j', () => this.next());
    this.hotkeys.on('k', () => this.prev());
    this.hotkeys.on('arrowdown', () => this.next());
    this.hotkeys.on('arrowup', () => this.prev());
  }

  private next() {
    // next item
  }

  private prev() {
    // previous item
  }
}
```

## Global shortcuts that work in inputs

```ts
this.hotkeys.on('mod+enter', () => this.submit(), { allowInInput: true });
```
