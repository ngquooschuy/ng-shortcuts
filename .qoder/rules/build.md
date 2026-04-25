---
trigger: always_on
---
You are a senior Angular library engineer. Build a production-ready **minimal Angular hotkeys library v1** named **ngx-hotkeys**.

## Goal

Create a tiny, elegant, Angular-native keyboard shortcut library with excellent DX.

This is **NOT** an over-engineered enterprise framework.

Focus on:

* Simplicity
* Clean API
* Small codebase
* Angular best practices
* Ready to publish to npm

---

## Tech Requirements

* Angular 17+
* TypeScript strict mode
* Standalone compatible
* Tree-shakable
* SSR safe (no direct unsafe browser access)
* Use Angular dependency injection
* Use `DestroyRef` for auto cleanup
* No external dependencies

---

## Core API

```ts
const hotkeys = injectHotkeys();

hotkeys.on('mod+k', () => openSearch());

hotkeys.on('esc', () => closeModal());

hotkeys.on('mod+s', save, {
  preventDefault: true
});
```

Return unregister function:

```ts
const off = hotkeys.on('j', nextRow);
off();
```

---

## Required Features (v1 only)

### Keyboard support

* `mod+k`
* `mod+s`
* `esc`
* `enter`
* `shift+enter`
* `alt+1`
* arrow keys

### mod behavior

* Mac => `meta`
* Windows/Linux => `ctrl`

### UX behavior

* Ignore shortcuts inside:

  * input
  * textarea
  * select
  * contenteditable

Unless:

```ts
allowInInput: true
```

### Options

```ts
interface HotkeyOptions {
  preventDefault?: boolean;
  allowInInput?: boolean;
}
```

### Auto cleanup

If used inside component/service injection context, listeners should auto unregister on destroy.

---

## Public API Surface

Only export:

```ts
HotkeysService
injectHotkeys()
HotkeyOptions
```

Keep API intentionally small.

---

## File Structure

```text
projects/ngx-hotkeys/src/lib/

hotkeys.service.ts
parser.ts
types.ts
inject-hotkeys.ts
public-api.ts
```

---

## Code Quality Rules

* Strong typing
* Readable code
* Minimal abstractions
* No premature architecture
* No scopes
* No directives
* No registry system
* No plugins
* No RxJS unless truly necessary

---

## Deliverables

Generate full source code for every file.

Also generate:

1. package.json
2. ng-package.json
3. README.md
4. Example Angular usage
5. Build & publish instructions

---

## README should market it like this:

> Keyboard shortcuts for Angular in one line.

---

## Success Criteria

When developer installs package, this should work immediately:

```ts
const hotkeys = injectHotkeys();

hotkeys.on('mod+k', () => console.log('Open'));
hotkeys.on('esc', () => console.log('Close'));
```

---

Build this like a polished open-source package that could gain GitHub stars.
