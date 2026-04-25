import { ParsedHotkey } from './types';

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  space: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  arrowup: 'arrowup',
  arrowdown: 'arrowdown',
  arrowleft: 'arrowleft',
  arrowright: 'arrowright',
};

export function parseHotkey(shortcut: string): ParsedHotkey {
  const parts = shortcut.toLowerCase().split('+').map((p) => p.trim());

  const result: ParsedHotkey = {
    key: '',
    ctrl: false,
    meta: false,
    shift: false,
    alt: false,
    mod: false,
  };

  for (const part of parts) {
    if (part === 'mod') {
      result.mod = true;
    } else if (part === 'ctrl') {
      result.ctrl = true;
    } else if (part === 'meta') {
      result.meta = true;
    } else if (part === 'shift') {
      result.shift = true;
    } else if (part === 'alt') {
      result.alt = true;
    } else {
      result.key = KEY_ALIASES[part] ?? part;
    }
  }

  if (!result.key) {
    throw new Error(`Invalid hotkey: "${shortcut}". No key found.`);
  }

  return result;
}

export function matchHotkey(event: KeyboardEvent, parsed: ParsedHotkey): boolean {
  if (event.key.toLowerCase() !== parsed.key.toLowerCase()) {
    return false;
  }

  const isMac =
    typeof navigator !== 'undefined' &&
    navigator.platform.toLowerCase().includes('mac');

  const expectCtrl = parsed.ctrl || (parsed.mod && !isMac);
  const expectMeta = parsed.meta || (parsed.mod && isMac);
  const expectShift = parsed.shift;
  const expectAlt = parsed.alt;

  if (expectCtrl !== event.ctrlKey) return false;
  if (expectMeta !== event.metaKey) return false;
  if (expectShift !== event.shiftKey) return false;
  if (expectAlt !== event.altKey) return false;

  return true;
}
