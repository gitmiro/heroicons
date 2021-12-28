import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {HeroIconName} from '../../icons/icons-names';
import {toCamelCase} from '../../helpers';
import {HI_ICON_SET_TOKEN, HI_OPTIONS_TOKEN} from '../../injection-tokens';
import {HeroIconDefaultHostDisplay, HeroIconOptions,} from '../../hero-icon.module';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'hero-icon',
    template: `
        <svg
                xmlns="http://www.w3.org/2000/svg"
                [attr.class]="class"
                [attr.viewBox]="type === 'solid' ? '0 0 20 20' : '0 0 24 24'"
                stroke="currentColor"
                fill="none"
                #svgRef
        ></svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['icon.component.scss'],
})
export class IconComponent implements AfterViewInit {
    @HostBinding('class.hi-d-block')
    private get isDisplayBlock() {
        return this.hostDisplay === 'block';
    }

    @HostBinding('class.hi-d-inline-block')
    private get isDisplayInlineBlock() {
        return this.hostDisplay === 'inlineBlock';
    }

    @HostBinding('class.hi-d-solid')
    private get shouldAttachDefaultSolidDimensions() {
        return (
            this.options.attachDefaultDimensionsIfNoneFound &&
            !this._hostHasDimensions &&
            this.type === 'solid'
        );
    }

    @HostBinding('class.hi-d-outline')
    private get shouldAttachDefaultOutlineDimensions() {
        return (
            this.options.attachDefaultDimensionsIfNoneFound &&
            !this._hostHasDimensions &&
            this.type === 'outline'
        );
    }

    @Input() name: HeroIconName;

    @Input() type: 'outline' | 'solid' = 'outline';

    @Input() hostDisplay: HeroIconDefaultHostDisplay = this.options
        .defaultHostDisplay as HeroIconDefaultHostDisplay;

    @Input() class = '';

    @ViewChild('svgRef') svg: ElementRef;

    /**
     * This has to start as true!!
     */
    _hostHasDimensions = true;

    private readonly icons: Readonly<Record<string, { solid: string; outline: string }>> = {};

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2,
        @Inject(HI_ICON_SET_TOKEN)
            iconsets: ReadonlyArray<Record<string, { solid: string; outline: string }>>,
        @Inject(HI_OPTIONS_TOKEN) private options: HeroIconOptions
    ) {
        // flatter the array into an object
        this.icons = iconsets.reduce((icons, iconset) => ({
            ...icons,
            ...iconset,
        }));
    }

    private __hostHasDimensions() {
        const hostWidth = window
            .getComputedStyle(this.elementRef.nativeElement, null)
            .getPropertyValue('width');
        const hostHeight = window
            .getComputedStyle(this.elementRef.nativeElement, null)
            .getPropertyValue('height');
        const hasWidth = parseInt(hostWidth) !== 0 && hostWidth !== 'auto';
        const hasHeight = parseInt(hostHeight) !== 0 && hostHeight !== 'auto';

        this._hostHasDimensions = hasWidth || hasHeight;
    }

    ngAfterViewInit(): void {
        // convert a hyphenated name into a camel case name
        const name = toCamelCase(this.name) as HeroIconName;

        // if there is no icon with this name warn the user as they probably forgot to import it
        // eslint-disable-next-line no-prototype-builtins
        if (!this.icons.hasOwnProperty(name)) {
            console.warn(
                `No icon named ${name} was found. You need to import it using the HeroIconModule.withIcons() on your @NgModule.`
            );
            return;
        }

        this.renderer.setProperty(
            this.svg.nativeElement,
            'innerHTML',
            this.icons[name][this.type]
        );

        if (this.options.attachDefaultDimensionsIfNoneFound) {
            this.__hostHasDimensions();
        }
    }
}
