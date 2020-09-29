import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import {ICON_SET_TOKEN} from "./tokens/icon-set.token";
import {IconComponent} from "./components/icon/icon.component";

@NgModule({
  declarations: [
      IconComponent
  ],
  exports: [
      IconComponent
  ]
})
export class HeroIconModule {
  // tslint:disable-next-line:no-any
  constructor(@Inject(ICON_SET_TOKEN) @Optional() icons: any) {
    if (!icons) {
      console.warn('No icons have been included. Import NgHeroIconsModule.withIcons({ ... }) to include some icons.');
    }
  }

  /**
   * Define the icons that you wish to include in the application.
   * Each module can choose which icons to include to improve
   * tree-shakability
   * @param icons The list of icons to include
   */
  static withIcons(icons: Record<string, { solid, outline }>): ModuleWithProviders<HeroIconModule> {
    return {
      ngModule: HeroIconModule,
      providers: [
        { provide: ICON_SET_TOKEN, useValue: icons, multi: true }
      ]
    };
  }
}
