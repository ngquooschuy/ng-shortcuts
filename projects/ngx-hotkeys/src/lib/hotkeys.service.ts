import { Injectable, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { HotkeyOptions, HotkeyHandler, ParsedHotkey, HotkeyShortcut, NormalizedOptions, CheatsheetItem } from './types';
import { parseHotkey, matchHotkey } from './parser';
import { SequenceEngine } from './sequence-engine';
import { formatShortcut } from './formatter';

interface Listener {
  shortcut: string;
  parsed: ParsedHotkey;
  handler: HotkeyHandler;
  options: NormalizedOptions;
}

const DEFAULT_OPTIONS: NormalizedOptions = {
  preventDefault: false,
  allowInInput: false,
  enabled: true,
  sequenceTimeout: undefined,
};

function isEnabled(enabled: boolean | (() => boolean)): boolean {
  return typeof enabled === 'function' ? enabled() : enabled;
}

function wrapHandler(
  handler: HotkeyHandler,
  options: NormalizedOptions,
  isInputActive: () => boolean
): HotkeyHandler {
  return (event: KeyboardEvent) => {
    if (!options.allowInInput && isInputActive()) {
      return;
    }
    if (!isEnabled(options.enabled)) {
      return;
    }
    if (options.preventDefault) {
      event.preventDefault();
    }
    handler(event);
  };
}

@Injectable({ providedIn: 'root' })
export class HotkeysService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef, { optional: true });
  private listeners = new Map<string, Listener[]>();
  private sequenceEngine = new SequenceEngine();
  private registry = new Map<string, string>();
  private boundHandler = this.handleKeydown.bind(this);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.document.addEventListener('keydown', this.boundHandler);

      this.destroyRef?.onDestroy(() => {
        this.document.removeEventListener('keydown', this.boundHandler);
      });
    }
  }

  on(shortcut: HotkeyShortcut, handler: HotkeyHandler, options?: HotkeyOptions): () => void {
    const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
    const offs: (() => void)[] = [];

    for (const s of shortcuts) {
      offs.push(this.registerSingle(s, handler, options));
    }

    return () => {
      for (const off of offs) {
        off();
      }
    };
  }

  format(shortcut: string): string {
    return formatShortcut(shortcut);
  }

  getRegistered(): CheatsheetItem[] {
    return Array.from(this.registry.entries()).map(([keys, label]) => ({ keys, label }));
  }

  private registerSingle(shortcut: string, handler: HotkeyHandler, options?: HotkeyOptions): () => void {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    if (shortcut.includes(' ')) {
      const wrapped = wrapHandler(handler, opts, () => this.isInputActive());
      const off = this.sequenceEngine.register(shortcut, wrapped, opts);
      this.destroyRef?.onDestroy(off);
      return off;
    }

    const parsed = parseHotkey(shortcut);
    const listener: Listener = { shortcut, parsed, handler, options: opts };

    const list = this.listeners.get(shortcut) ?? [];
    list.push(listener);
    this.listeners.set(shortcut, list);

    if (opts.description) {
      this.registry.set(shortcut, opts.description);
    }

    const off = () => {
      const current = this.listeners.get(shortcut) ?? [];
      const idx = current.indexOf(listener);
      if (idx !== -1) {
        current.splice(idx, 1);
        if (current.length === 0) {
          this.listeners.delete(shortcut);
        } else {
          this.listeners.set(shortcut, current);
        }
      }
      if (opts.description) {
        this.registry.delete(shortcut);
      }
    };

    this.destroyRef?.onDestroy(off);
    return off;
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (this.sequenceEngine.process(event)) {
      return;
    }

    for (const [, list] of this.listeners) {
      for (const listener of list) {
        if (matchHotkey(event, listener.parsed)) {
          if (!listener.options.allowInInput && this.isInputActive()) {
            continue;
          }
          if (!isEnabled(listener.options.enabled)) {
            continue;
          }
          if (listener.options.preventDefault) {
            event.preventDefault();
          }
          listener.handler(event);
        }
      }
    }
  }

  private isInputActive(): boolean {
    const active = this.document.activeElement;
    if (!active) return false;

    const tag = active.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      return true;
    }
    if (active.getAttribute('contenteditable') === 'true') {
      return true;
    }
    return false;
  }
}
