import { InjectionToken } from '@angular/core';
import { HeroIconOptions } from './hero-icon.module';

export const HI_ICON_SET_TOKEN = new InjectionToken(
    'HeroIconModule ItemSet Token'
);
export const HI_OPTIONS_TOKEN = new InjectionToken<HeroIconOptions>(
    'HeroIconModule Options Token'
);
