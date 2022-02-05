import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
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
                [attr.viewBox]="_type === 'solid' ? '0 0 20 20' : '0 0 24 24'"
                stroke="currentColor"
                fill="none"
                #svgRef
        ></svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['icon.component.scss'],
})
export class IconComponent implements AfterViewInit, OnDestroy {

    @HostBinding('class.hi-d-block') get isDisplayBlock() {
        return this.hostDisplay === 'block';
    }

    @HostBinding('class.hi-d-inline-block') get isDisplayInlineBlock() {
        return this.hostDisplay === 'inlineBlock';
    }

    _currRendered: {
        name: HeroIconName,
        type: 'outline' | 'solid'
    } = null;

    _name: HeroIconName;

    @Input() set name(value: HeroIconName) {
        const camelCasedIconName = toCamelCase(value);
        // if there is no icon with this name warn the user as they probably forgot to import it
        if (!this.icons.hasOwnProperty(camelCasedIconName)) {
            this._name = null;
            console.warn(
                `No icon named ${camelCasedIconName} was found. You need to import it using the HeroIconModule.withIcons() on your @NgModule.`
            );
            return;
        }
        this._name = camelCasedIconName as HeroIconName;
        this.__renderIcon();
    }


    _type: 'outline' | 'solid' = 'outline';

    @Input() set type(value: 'outline' | 'solid') {
        this._type = ['outline', 'solid'].includes(value) ? value : 'outline';
        this.__renderIcon();
    }

    @Input() hostDisplay: HeroIconDefaultHostDisplay = this.options.defaultHostDisplay as HeroIconDefaultHostDisplay;

    _oldClasses = [];
    _classes = null;

    @Input() set class(value: string) {
        this._classes = value;
        this.__applyClasses();
    }

    @ViewChild('svgRef') _svgRef: ElementRef<SVGElement>;

    _isAfterViewInit = false;

    resizeObserver: ResizeObserver;

    private readonly icons: Readonly<Record<string, { solid: string; outline: string }>> = {};

    constructor(
        private readonly _elementRef: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2,
        @Inject(HI_ICON_SET_TOKEN)
            iconsets: ReadonlyArray<Record<string, { solid: string; outline: string }>>,
        @Inject(HI_OPTIONS_TOKEN) private options: HeroIconOptions
    ) {
        // Flatter the array into an object
        this.icons = iconsets.reduce((icons, iconset) => ({
            ...icons,
            ...iconset,
        }));

        // ResizeObserver
        if (this.options.attachDefaultDimensionsIfNoneFound) {
            this.resizeObserver = new ResizeObserver(() => this.__attachRootDimensionClass());
            this.resizeObserver.observe(this._elementRef.nativeElement);
        }
    }

    ngAfterViewInit(): void {
        this._isAfterViewInit = true;
        this.__renderIcon();
        this._oldClasses = this._elementRef.nativeElement.classList.value.split(' ').filter((clz) => {
            return !['hi-d-outline', 'hi-d-solid', 'hi-d-block', 'hi-d-inline-block'].includes(clz);
        });
        this.__applyClasses();

        // Attach default dimensions after first icon render
        // consecutive changes on class will trigger ResizeObserver
        if (this.options.attachDefaultDimensionsIfNoneFound) {
            this.__attachRootDimensionClass();
        }
    }

    private __applyClasses() {
        // set svg class
        if (this._svgRef) {
            // Remove previous classes
            if (this._oldClasses.length > 0) {
                this._elementRef.nativeElement.classList.remove(...this._oldClasses);
                this._svgRef.nativeElement.classList.remove(...this._oldClasses);
            }
            // Attach new classes
            const clz = this._classes.trim().length > 0 ? this._classes.trim().split(' ') : [];
            this._oldClasses = clz;
            if (clz.length > 0) {
                this._svgRef.nativeElement.classList.add(...clz);
            }
        }
    }

    private __attachRootDimensionClass() {
        this._elementRef.nativeElement.classList.remove('hi-d-outline', 'hi-d-solid');

        setTimeout(() => {
            const rootElem = this._elementRef.nativeElement;
            const {width: rootWidth, height: rootHeight} = rootElem.getBoundingClientRect();
            const rootHasDimensions = rootWidth > 0 && rootHeight > 0;
            const svgElem = this._svgRef.nativeElement;
            const {width: svgWidth, height: svgHeight} = svgElem.getBoundingClientRect();
            const svgHasDimensions = svgWidth > 0 && svgHeight > 0;

            if (!rootHasDimensions && !svgHasDimensions) {
                rootElem.classList.add(this._type === 'outline' ? 'hi-d-outline' : 'hi-d-solid');
            }
        });
    }

    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    private get __needsToRender() {
        if (!this._isAfterViewInit || !this._name || !this._type)
            return false;

        return !this._currRendered || !(this._currRendered.name === this._name && this._currRendered.type === this._type);
    }

    private __renderIcon() {
        if (!this.__needsToRender) return;

        this.renderer.setProperty(
            this._svgRef.nativeElement,
            'innerHTML',
            this.icons[this._name][this._type]
        );
        this._currRendered = {
            name: this._name,
            type: this._type
        };
    }
}
