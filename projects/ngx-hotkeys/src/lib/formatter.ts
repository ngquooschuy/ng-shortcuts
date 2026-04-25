const MAC_MODIFIERS: Record<string, string> = {
    mod: '⌘',
    ctrl: '⌃',
    alt: '⌥',
    shift: '⇧',
};

const MAC_KEYS: Record<string, string> = {
    enter: '↵',
    esc: '⎋',
    tab: '⇥',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    space: 'Space',
};

const WIN_MODIFIERS: Record<string, string> = {
    mod: 'Ctrl',
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
};

const WIN_KEYS: Record<string, string> = {
    enter: 'Enter',
    esc: 'Esc',
    tab: 'Tab',
    arrowup: 'Up',
    arrowdown: 'Down',
    arrowleft: 'Left',
    arrowright: 'Right',
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right',
    space: 'Space',
};

function isMacPlatform(): boolean {
    return (
        typeof navigator !== 'undefined' &&
        navigator.platform.toLowerCase().includes('mac')
    );
}

function capitalize(s: string): string {
    return s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s;
}

function formatStep(step: string, mac: boolean): string {
    const parts = step.toLowerCase().split('+').map((p) => p.trim());
    const modifiers: string[] = [];
    let key = '';

    for (const part of parts) {
        if (part === 'mod' || part === 'ctrl' || part === 'alt' || part === 'shift') {
            modifiers.push(part);
        } else {
            key = part;
        }
    }

    if (mac) {
        const modSymbols = modifiers.map((m) => MAC_MODIFIERS[m] ?? m);
        const keySymbol = MAC_KEYS[key] ?? key.toUpperCase();
        return modSymbols.join('') + keySymbol;
    }

    const modLabels = modifiers.map((m) => WIN_MODIFIERS[m] ?? capitalize(m));
    const keyLabel = WIN_KEYS[key] ?? capitalize(key);
    return [...modLabels, keyLabel].join('+');
}

export function formatShortcut(shortcut: string): string {
    const mac = isMacPlatform();
    return shortcut
        .split(' ')
        .map((s) => formatStep(s.trim(), mac))
        .join(' ');
}
