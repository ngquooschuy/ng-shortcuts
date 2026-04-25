---
trigger: always_on
---
You are a senior Angular library engineer.

Upgrade an existing minimal keyboard shortcut library named **ngx-hotkeys** from v1 to **v1.1**.

Your mission is to build a polished, Angular-native release with an API quality level similar to official Angular packages.

---

# Product Vision

`ngx-hotkeys` should feel like:

* tiny
* elegant
* Angular-first
* strongly typed
* easy to learn
* easy to adopt
* production ready

Do NOT over-engineer.

No enterprise architecture.

No plugin systems.

No unnecessary abstractions.

---

# Existing v1 Core API

```ts id="n6p6xm"
const hotkeys = injectHotkeys();

hotkeys.on('mod+k', openSearch);

hotkeys.on('esc', closeModal);

hotkeys.on('mod+s', save, {
  preventDefault: true
});
```

Keep backward compatibility.

---

# v1.1 Goals

Implement these 3 upgrades:

1. Directive API (highest priority)
2. Multiple shortcuts support
3. Enabled option

---

# Angular Version

* Angular 17+
* Standalone compatible
* Strict TypeScript
* Tree-shakable
* SSR safe
* No external dependencies

---

# Required Public API

## Service API

```ts id="vvwz3j"
hotkeys.on('mod+k', openSearch);

hotkeys.on(['mod+k', '/'], openSearch);

hotkeys.on('mod+s', save, {
  preventDefault: true,
  enabled: true
});

hotkeys.on('mod+s', save, {
  enabled: () => form.valid
});
```

Return cleanup function:

```ts id="3vk6q7"
const off = hotkeys.on('j', nextRow);
off();
```

---

# Hotkey Options

```ts id="0m4m9h"
export interface HotkeyOptions {
  preventDefault?: boolean;
  allowInInput?: boolean;
  enabled?: boolean | (() => boolean);
}
```

---

# Directive API (very important)

Design it beautifully, like Angular official APIs.

## Selector

```html id="cyh2av"
[hotkey]
```

## Basic Usage

```html id="x0wkrn"
<button
  [hotkey]="'mod+s'"
  (hotkeyTriggered)="save()">
  Save
</button>
```

## Multiple Shortcuts

```html id="f1l8q0"
<button
  [hotkey]="['mod+k', '/']"
  (hotkeyTriggered)="openSearch()">
</button>
```

## With Inputs

```html id="1u3uwg"
<div
  [hotkey]="'esc'"
  [hotkeyEnabled]="isOpen"
  [hotkeyPreventDefault]="true"
  (hotkeyTriggered)="close()">
</div>
```

---

# Directive Requirements

Use Angular patterns similar to official directives:

* `@Input() hotkey`
* `@Input() hotkeyEnabled`
* `@Input() hotkeyPreventDefault`
* `@Input() hotkeyAllowInInput`
* `@Output() hotkeyTriggered`

Typed output:

```ts id="w1ekiv"
EventEmitter<KeyboardEvent>
```

Directive must auto cleanup on destroy.

---

# Keyboard Rules

Support:

* mod+k
* mod+s
* esc
* enter
* shift+enter
* alt+1
* arrow keys

`mod` means:

* Mac => meta
* Windows/Linux => ctrl

---

# UX Rules

Ignore shortcuts inside:

* input
* textarea
* select
* contenteditable

Unless:

```ts id="0hx4f4"
allowInInput: true
```

---

# File Structure

```text id="44g36v"
projects/ngx-hotkeys/src/lib/

hotkeys.service.ts
hotkey.directive.ts
parser.ts
types.ts
inject-hotkeys.ts
public-api.ts
README.md
```

---

# Code Quality Rules

* Clean architecture
* Readable code
* Strong typing
* Minimal bundle size
* No RxJS unless truly necessary
* No scopes
* No registries
* No priority engine
* No feature creep

---

# Deliverables

Generate full source code for every file.

Include:

1. Updated service
2. Full directive implementation
3. Types
4. Parser helpers
5. public-api.ts
6. README.md with examples
7. Migration notes from v1 to v1.1

---

# README Tone

Professional open-source package.

Top headline:

> Keyboard shortcuts for Angular in one line.

---

# Success Criteria

This should feel delightful:

```html id="j7v4qt"
<button
  [hotkey]="'mod+s'"
  (hotkeyTriggered)="save()">
</button>
```

and

```ts id="6sk3sn"
hotkeys.on(['mod+k', '/'], openSearch);
```

Build this like a library that Angular developers will immediately trust and enjoy using.
