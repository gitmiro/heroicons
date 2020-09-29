import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, AfterViewInit, Renderer2, ViewChild } from '@angular/core';
import { ICON_SET_TOKEN } from '../../tokens/icon-set.token';
import * as camelcase from 'camelcase';
import {HeroIconName} from "../../icons/icons-names";

@Component({
  selector: 'hero-icon',
  template: `
     <svg #svgRef xmlns="http://www.w3.org/2000/svg" [attr.class]="klass" fill="none" [attr.viewBox]="type === 'solid' ? '0 0 20 20' : '0 0 24 24'" stroke="currentColor">
     </svg>
  ` ,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['icon.component.scss']
})
export class IconComponent implements AfterViewInit {

  /** Define the name of the icon to display */
  @Input() name: HeroIconName | undefined;

  /** Define the size of the icon */
  @Input() type: "outline" | "solid" = 'outline';

  @Input('class') klass: string = '';

  @ViewChild('svgRef') svg: ElementRef;

  /**
   * Store the icons in a flattened object. The will be injected as any array of objects
   * due to the provider using `multi`.
   */
  private readonly icons: Readonly<Record<string, { solid, outline }>> = {};

  constructor(
      private readonly elementRef: ElementRef<HTMLElement>,
      private readonly renderer: Renderer2,
      // tslint:disable-next-line:no-any
      @Inject(ICON_SET_TOKEN) iconsets: any) {

    // cast the injected values
    const iconsetGroups = iconsets as ReadonlyArray<Record<string, { solid, outline }>>;

    // flatter the array into an object
    this.icons = iconsetGroups.reduce((icons, iconset) => ({ ...icons, ...iconset }));
  }

  ngAfterViewInit(): void {
    // convert a hyphenated name into a camel case name
    const name = camelcase(this.name) as HeroIconName;

    // if there is no icon with this name warn the user as they probably forgot to import it
    if (!this.icons.hasOwnProperty(name)) {
      console.warn(`No icon named ${ name } was found. You may need to import it using the withIcons function.`);
      return;
    }

    this.renderer.setProperty(this.svg.nativeElement, 'innerHTML', this.icons[name][this.type]);
  }

}
