export interface HotkeyOptions {
  preventDefault?: boolean;
  allowInInput?: boolean;
  enabled?: boolean | (() => boolean);
  sequenceTimeout?: number;
  description?: string;
}

export interface CheatsheetItem {
  keys: string;
  label: string;
}

export type HotkeyHandler = (event: KeyboardEvent) => void;

export interface ParsedHotkey {
  key: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  mod: boolean;
}

export type HotkeyShortcut = string | string[];

export type NormalizedOptions = Required<Omit<HotkeyOptions, 'sequenceTimeout' | 'description'>> &
  Pick<HotkeyOptions, 'sequenceTimeout' | 'description'>;
