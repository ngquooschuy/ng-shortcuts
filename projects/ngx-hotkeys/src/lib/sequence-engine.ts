import { ParsedHotkey, HotkeyHandler, NormalizedOptions } from './types';
import { parseHotkey, matchHotkey } from './parser';

interface SequenceListener {
    steps: ParsedHotkey[];
    handler: HotkeyHandler;
    options: NormalizedOptions;
}

interface Candidate {
    listener: SequenceListener;
    stepIndex: number;
}

const DEFAULT_TIMEOUT = 1000;

export class SequenceEngine {
    private sequences: SequenceListener[] = [];
    private candidates: Candidate[] = [];
    private lastTimestamp = 0;

    register(shortcut: string, handler: HotkeyHandler, options: NormalizedOptions): () => void {
        const steps = shortcut.split(' ').map((s) => parseHotkey(s.trim()));
        const listener: SequenceListener = { steps, handler, options };
        this.sequences.push(listener);

        return () => {
            const idx = this.sequences.indexOf(listener);
            if (idx !== -1) {
                this.sequences.splice(idx, 1);
            }
            this.removeCandidate(listener);
        };
    }

    process(event: KeyboardEvent): boolean {
        if (this.candidates.length > 0 && this.isTimedOut()) {
            this.reset();
        }

        if (this.candidates.length > 0) {
            return this.advance(event);
        }

        return this.start(event);
    }

    private start(event: KeyboardEvent): boolean {
        const starters = this.sequences.filter((s) => matchHotkey(event, s.steps[0]));
        if (starters.length === 0) {
            return false;
        }

        const multiStep = starters.filter((s) => s.steps.length > 1);
        if (multiStep.length === 0) {
            return false;
        }

        this.candidates = multiStep.map((s) => ({ listener: s, stepIndex: 1 }));
        this.lastTimestamp = Date.now();
        return true;
    }

    private advance(event: KeyboardEvent): boolean {
        const completed: SequenceListener[] = [];
        const next: Candidate[] = [];

        for (const c of this.candidates) {
            if (matchHotkey(event, c.listener.steps[c.stepIndex])) {
                if (c.stepIndex === c.listener.steps.length - 1) {
                    completed.push(c.listener);
                } else {
                    next.push({ listener: c.listener, stepIndex: c.stepIndex + 1 });
                }
            }
        }

        if (completed.length > 0) {
            for (const listener of completed) {
                listener.handler(event);
            }
            this.reset();
            return true;
        }

        if (next.length > 0) {
            this.candidates = next;
            this.lastTimestamp = Date.now();
            return true;
        }

        this.reset();
        return false;
    }

    private isTimedOut(): boolean {
        const timeouts = this.candidates.map(
            (c) => c.listener.options.sequenceTimeout ?? DEFAULT_TIMEOUT
        );
        const timeout = Math.min(...timeouts);
        return Date.now() - this.lastTimestamp > timeout;
    }

    private reset(): void {
        this.candidates = [];
        this.lastTimestamp = 0;
    }

    private removeCandidate(listener: SequenceListener): void {
        this.candidates = this.candidates.filter((c) => c.listener !== listener);
        if (this.candidates.length === 0) {
            this.lastTimestamp = 0;
        }
    }
}
