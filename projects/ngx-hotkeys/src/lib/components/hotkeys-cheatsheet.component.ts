import { Component, Input, inject } from '@angular/core';
import { HotkeyBadgeComponent } from './hotkey-badge.component';
import { HotkeysService } from '../hotkeys.service';
import { CheatsheetItem } from '../types';

@Component({
    selector: 'ngx-hotkeys-cheatsheet',
    standalone: true,
    imports: [HotkeyBadgeComponent],
    template: `
    <section class="ngx-hotkeys-cheatsheet" role="region" [attr.aria-label]="title">
      <h3 class="ngx-hotkeys-cheatsheet-title">{{ title }}</h3>
      <dl class="ngx-hotkeys-cheatsheet-list">
        @for (item of resolvedItems; track item.keys) {
          <div class="ngx-hotkeys-cheatsheet-row">
            <dt class="ngx-hotkeys-cheatsheet-label">{{ item.label }}</dt>
            <dd class="ngx-hotkeys-cheatsheet-keys">
              <ngx-hotkey-badge [keys]="item.keys"></ngx-hotkey-badge>
            </dd>
          </div>
        }
      </dl>
    </section>
  `,
    styles: [`
    :host { display: block; }
    .ngx-hotkeys-cheatsheet {
      padding: 16px;
      background: var(--ngx-hotkeys-sheet-bg, #ffffff);
      border: 1px solid var(--ngx-hotkeys-sheet-border, #e5e7eb);
      border-radius: 8px;
      max-width: 400px;
    }
    .ngx-hotkeys-cheatsheet-title {
      margin: 0 0 12px 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--ngx-hotkeys-sheet-title, #111827);
    }
    .ngx-hotkeys-cheatsheet-list {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ngx-hotkeys-cheatsheet-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .ngx-hotkeys-cheatsheet-label {
      margin: 0;
      font-size: 0.875rem;
      color: var(--ngx-hotkeys-sheet-label, #374151);
    }
    .ngx-hotkeys-cheatsheet-keys {
      margin: 0;
      flex-shrink: 0;
    }
  `],
})
export class HotkeysCheatsheetComponent {
    private hotkeys = inject(HotkeysService);

    @Input() title = 'Keyboard Shortcuts';
    @Input() items?: CheatsheetItem[];

    get resolvedItems(): CheatsheetItem[] {
        return this.items ?? this.hotkeys.getRegistered();
    }
}
