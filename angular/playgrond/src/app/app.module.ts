import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {allIcons, HeroIconModule} from 'ng-heroicon';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HeroIconModule.forRoot({
            ...allIcons
        }, {
            defaultHostDisplay: 'block',
            attachDefaultDimensionsIfNoneFound: true
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
