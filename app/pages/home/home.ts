import {Component} from '@angular/core';
import {WebSocketService} from '../../service/websocket';
import {ScheduleService} from '../../service/schedule';
import {DomSanitizationService} from '@angular/platform-browser';
import {Platform} from 'ionic-angular';
import {EventBus} from '../../service/eventbus';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class Home {
    private isStopped = true;
    private imgUrl: Array<any> = [];
    private adHeight;
    private cardImgHeight;
    program = {
        name: null,
        hostedBy: null,
        artistImgUrl: null
    };
    homeSliderOptions = {
        autoplay: 5000,
        loop: true,
        pager: true
    };

    constructor(private wsService: WebSocketService,
        private scheduleService: ScheduleService,
        private sanitizer: DomSanitizationService,
        private platform: Platform,
        private eventBus: EventBus) {
        // this.wsService.adEvent.subscribe();  
        this.adHeight = sanitizer.bypassSecurityTrustStyle('height : ' + (platform.height() * .33) + 'px');
        this.cardImgHeight = sanitizer.bypassSecurityTrustStyle('height : ' + (platform.height() * .25) + 'px');

        this.wsService.adEvent.subscribe(evt => {
            if (evt.mess) {
                if (evt.mess.length > this.imgUrl.length) {
                    this.processAndSetImageUrls(evt.mess);
                } else {
                    let newItemsFound = false;
                    for (let i = 0; i < evt.mess.length; i++) {
                        if (this.imgUrl[i] !== this.sanitizer.bypassSecurityTrustUrl(evt.mess.bufferUrl)) {
                            newItemsFound = true;
                            break;
                        }
                    }
                    if (newItemsFound) {
                        this.processAndSetImageUrls(evt.mess);
                    }
                }

            }
        });
        this.scheduleService.scheduleRecieveEvent.subscribe(schedules => {
            this.program = {
                name: null,
                hostedBy: null,
                artistImgUrl: null
            };
            if (schedules[0].programs && schedules[0].programs.length > 0) {
                this.program.name = schedules[0].programs[0].programName;
                this.program.hostedBy = schedules[0].programs[0].hostedBy;
                let artistImgUrl = this.sanitizer.bypassSecurityTrustUrl(
                    this.scheduleService.resourceUrl.substring(0, this.scheduleService.resourceUrl.length - 1)
                    + schedules[0].programs[0].artistImgUrl);
                this.program.artistImgUrl = artistImgUrl;
            }
        });
        this.wsService.initiateWebSocket();
        this.scheduleService.getSchedule();
    }

    onclick(event: any) {
        if (event.target.id === 'play') {
            this.isStopped = false;
            this.eventBus.triggerStreamActionEvent(true);
        } else {
            this.isStopped = true;
            this.eventBus.triggerStreamActionEvent(false);
        }
    }

    processAndSetImageUrls(messages) {
        let messArray = [];
        for (let mess of messages) {
            messArray.push(this.sanitizer.bypassSecurityTrustUrl(mess.bufferUrl));
        }
        this.imgUrl = messArray;
    }
}
