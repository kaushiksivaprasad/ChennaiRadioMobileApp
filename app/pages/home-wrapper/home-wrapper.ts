import {Component} from '@angular/core';
import {Home} from '../home/home';
import {Schedules} from '../schedules/schedules';

@Component({
    templateUrl: 'build/pages/home-wrapper/home-wrapper.html',
})
export class HomeWrapper {
    nowPlaying = Home;
    schedule = Schedules;
}
