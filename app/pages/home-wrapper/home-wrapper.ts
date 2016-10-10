import {Component} from '@angular/core';
import {Home} from '../home/home';
import {Schedules} from '../schedules/schedules';
import {WebSocketService} from '../../service/websocket';

@Component({
    templateUrl: 'build/pages/home-wrapper/home-wrapper.html',
})
export class HomeWrapper {
    nowPlaying = Home;
    schedule = Schedules;
    public constructor(private wsService : WebSocketService){
        this.wsService.addListener(this);
    }
    onEventRecieved(evt){

    }
}
