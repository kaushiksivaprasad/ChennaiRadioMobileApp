import {Component} from '@angular/core';
import {Home} from '../home/home';
import {Schedules} from '../schedules/schedules';
import {RegistrationService} from '../../service/registration';
// import WebSocketService from '../../service/websocket';


@Component({
    templateUrl: 'build/pages/home-wrapper/home-wrapper.html',
})
export class HomeWrapper {
    nowPlaying = Home;
    schedule = Schedules;
    t: Array<{ name: String }> = [];
    public constructor() {
        // this.wsService.addListener(this);
        setInterval(() => {
            this.t.push({ name: 'hot' });
        }, 3000);
    }
    onEventRecieved(evt) {

    }
}
