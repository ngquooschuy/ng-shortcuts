import {
    Directive,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    OnDestroy,
    inject,
} from '@angular/core';
import { HotkeysService } from './hotkeys.service';
import { HotkeyShortcut, HotkeyOptions } from './types';

@Directive({
    selector: '[hotkey]',
    standalone: true,
})
export class HotkeyDirective implements OnChanges, OnDestroy {
    private hotkeys = inject(HotkeysService);
    private cleanup?: () => void;

    @Input({ required: true }) hotkey!: HotkeyShortcut;
    @Input() hotkeyEnabled?: boolean | (() => boolean);
    @Input() hotkeyPreventDefault?: boolean;
    @Input() hotkeyAllowInInput?: boolean;
    @Input() hotkeySequenceTimeout?: number;

    @Output() hotkeyTriggered = new EventEmitter<KeyboardEvent>();

    ngOnChanges(): void {
        this.unregister();
        this.register();
    }

    ngOnDestroy(): void {
        this.unregister();
    }

    private register(): void {
        if (!this.hotkey) {
            return;
        }

        const options: HotkeyOptions = {
            enabled: this.hotkeyEnabled,
            preventDefault: this.hotkeyPreventDefault,
            allowInInput: this.hotkeyAllowInInput,
            sequenceTimeout: this.hotkeySequenceTimeout,
        };

        this.cleanup = this.hotkeys.on(this.hotkey, (event) => {
            this.hotkeyTriggered.emit(event);
        }, options);
    }

    private unregister(): void {
        this.cleanup?.();
        this.cleanup = undefined;
    }
}
