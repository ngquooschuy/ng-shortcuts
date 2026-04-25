import { Component, Input } from '@angular/core';
import { formatShortcut } from '../formatter';

@Component({
    selector: 'ngx-hotkey-badge',
    standalone: true,
    template: `<span class="ngx-hotkey-badge">{{ formatted }}</span>`,
    styles: [`
    :host {
      display: inline-flex;
    }
    .ngx-hotkey-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--ngx-hotkey-badge-color, #374151);
      background: var(--ngx-hotkey-badge-bg, #f3f4f6);
      border: 1px solid var(--ngx-hotkey-badge-border, #d1d5db);
      border-radius: 4px;
      box-shadow: 0 1px 0 var(--ngx-hotkey-badge-border, #d1d5db);
      white-space: nowrap;
      user-select: none;
    }
  `],
})
export class HotkeyBadgeComponent {
    @Input({ required: true }) keys!: string;

    get formatted(): string {
        return formatShortcut(this.keys);
    }
}
