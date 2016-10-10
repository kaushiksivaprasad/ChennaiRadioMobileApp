import {Component, OnInit} from '@angular/core';
import {RegistrationService} from '../../service/Registration'
import {WebSocketService} from '../../service/websocket';
import Utils from '../../utils/utils';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class Home extends OnInit {
    private imgList: Array<any>;
    homeSliderOptions = {
        autoplay: 5000,
        loop: true,
        pager: true
    };
    private ws = null;

    constructor(private regService: RegistrationService, private wsService: WebSocketService) {
        super();
    }



    ngOnInit() {
        //called after the constructor and called  after the first ngOnChanges() 
        this.wsService.addListener(this);
    }

    onEventRecieved(event: any): void {
        for (let img of event.mess) {
            this.imgList.push(img.bufferUrl)
        }
    }


}
