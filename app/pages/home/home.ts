import {Component} from '@angular/core';
import Utils from '../../utils/utils';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class Home {
    homeSliderOptions = {
        autoplay: 5000,
        loop: true,
        pager: true
    };
}
