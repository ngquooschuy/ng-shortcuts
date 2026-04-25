import { inject } from '@angular/core';
import { HotkeysService } from './hotkeys.service';

export function injectHotkeys(): HotkeysService {
  return inject(HotkeysService);
}
