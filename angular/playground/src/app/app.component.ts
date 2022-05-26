import {Component} from '@angular/core';
import {allIcons, HeroIconName} from 'ng-heroicon';
import {kebabCase} from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    allIconsNames = Object.keys(allIcons).map((icon) => kebabCase(icon));


    outlineIcon: HeroIconName = 'eye';
    solidIcon: HeroIconName = 'eye';

    onMouseEnter(type: 'outline' | 'solid') {
        if (type === 'outline') {
            this.outlineIcon = 'eye-off';
        } else {
            this.solidIcon = 'eye-off';
        }
    }

    onMouseLeave(type: 'outline' | 'solid') {
        if (type === 'outline') {
            this.outlineIcon = 'eye';
        } else {
            this.solidIcon = 'eye';
        }
    }
}
