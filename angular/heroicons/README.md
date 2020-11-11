# NG Heroicon

A set of free MIT-licensed high-quality SVG icons for you to use in your web projects.

This project is a fork of https://github.com/tailwindlabs/heroicons which enables
the use for Angular projects, providing a component to display the heroicon.

This project uses some code ideas from https://github.com/ashley-hunter/ng-heroicons, fixing some stuff
like enabling the icon className customization to inject TailwindCSS classes.

Preview and search at https://www.heroicons.com

## Installing Library

```
npm i ng-heroicon
```

or

```
yarn add ng-heroicon
```

## Using Icons

Import `HeroIconsModule` from 'ng-heroicons', along with any icons you want to include.
To include icons add them to the `withIcons` function call, e.g.:

```typescript
import { annotation, menu, HeroIconsModule } from 'ng-heroicon';

@NgModule({
  declarations: [
  ],
  imports: [
    HeroIconModule.withIcons({ 
      annotation,
      menu 
    })
  ],
})
export class AppModule {
}
```

You can import different icons in each lazy loaded module to reduce the icons loaded in each bundle.

To insert an icon use the following HTML:

```html
<hero-icon name="annotation" type="outline" class="w-6 h-6"></hero-icon>
<hero-icon name="annotation" type="solid" class="w-4 h4 text-gray-600"></hero-icon>
<hero-icon [name]="'menu'" [type]="'solid'" [class]="'w-4 h4 text-red-900'"></hero-icon>
```
