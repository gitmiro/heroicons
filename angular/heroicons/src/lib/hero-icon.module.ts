import {ModuleWithProviders, NgModule} from '@angular/core';
import {IconComponent} from './components';
import {HI_ICON_SET_TOKEN, HI_OPTIONS_TOKEN} from './injection-tokens';

export type HeroIconDefaultHostDisplay = 'block' | 'inlineBlock' | 'none';
export type HeroIconOptions = {
    /**
     * The default display mode for the host element.
     */
    defaultHostDisplay?: HeroIconDefaultHostDisplay;
    /**
     * This new option tries to figure out if the host element has
     * any sort of dimension, if it has not, it will attach default dimensions
     * to outline (h:24px, w:24px) or solid (h: 20px, w: 20px) icons automatically.
     * Passing any class or style with "width" or "height" will prevent this behavior.
     */
    attachDefaultDimensionsIfNoneFound?: boolean;
};

const defaultOptions: HeroIconOptions = {
    defaultHostDisplay: 'none',
    attachDefaultDimensionsIfNoneFound: false,
};

@NgModule({
    declarations: [IconComponent],
    exports: [IconComponent],
})
export class HeroIconModule {
    private static rootOptions: HeroIconOptions = defaultOptions;

    /**
     * @param icons The list of icons to include
     * @param options The global options for this module
     */
    static forRoot(
        icons: Record<string, { solid: string; outline: string }>,
        options?: HeroIconOptions
    ): ModuleWithProviders<HeroIconModule> {
        const opt = options
            ? {...HeroIconModule.rootOptions, ...options}
            : HeroIconModule.rootOptions;
        HeroIconModule.rootOptions = opt;
        return {
            ngModule: HeroIconModule,
            providers: [
                {provide: HI_ICON_SET_TOKEN, useValue: icons, multi: true},
                {provide: HI_OPTIONS_TOKEN, useValue: opt},
            ],
        };
    }

    /**
     * Define the icons that you wish to include in the application.
     * Each module can choose which icons to include to improve
     * tree-shakability
     * @param icons The list of icons to include
     * @param options options
     */
    static withIcons(
        icons: Record<string, { solid: string; outline: string }>,
        options?: HeroIconOptions
    ): ModuleWithProviders<HeroIconModule> {
        const opt = options
            ? {...HeroIconModule.rootOptions, ...options}
            : false;
        return {
            ngModule: HeroIconModule,
            providers: [
                {provide: HI_ICON_SET_TOKEN, useValue: icons, multi: true},
                opt ? {provide: HI_OPTIONS_TOKEN, useValue: opt} : [],
            ],
        };
    }
}
