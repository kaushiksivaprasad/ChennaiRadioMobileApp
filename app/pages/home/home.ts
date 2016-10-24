import { Component } from '@angular/core';
import { WebSocketService } from '../../service/websocket';
import { ScheduleService } from '../../service/schedule';
import { DomSanitizationService } from '@angular/platform-browser';
import { Platform } from 'ionic-angular';
import { EventBus } from '../../service/eventbus';
import Utils from '../../utils/utils';

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
        this.cardImgHeight = sanitizer.bypassSecurityTrustStyle('height : ' + (platform.height() * .28) + 'px');

        this.wsService.adEvent.subscribe(evt => {
            if (evt.mess) {
                if (evt.mess.length > this.imgUrl.length) {
                    this.processAndSetImageUrls(evt.mess);
                } else {
                    let newItemsFound = false;
                    for (let i = 0; i < evt.mess.length; i++) {
                        if (this.imgUrl[i] != this.sanitizer.bypassSecurityTrustUrl(evt.mess[i].bufferUrl)) {
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
            let program = Utils.extractFirstProgramFromSchedule(schedules);
            if (program) {
                this.program = {
                    name: null,
                    hostedBy: null,
                    artistImgUrl: null
                };
                program.artistImgUrl = this.sanitizer.bypassSecurityTrustUrl(
                    this.scheduleService.resourceUrl.substring(0, this.scheduleService.resourceUrl.length - 1)
                    + program.artistImgUrl);
                this.program = program;
            }
        });

        this.eventBus.streamActionEvent.subscribe(event => {
            if (event.src !== this.THIS_CLASS) {
                if (event.isPlaying) {
                    this.isStopped = false;
                } else {
                    this.isStopped = true;
                }
            }
        });
        this.wsService.initiateWebSocket();
        this.scheduleService.getSchedule();
    }

    onclick(event: any) {
        let emittedEvent = {
            src: this.THIS_CLASS,
            isPlaying: null
        };
        if (event.target.id === 'play') {
            this.isStopped = false;
            emittedEvent.isPlaying = true;
            this.eventBus.triggerStreamActionEvent(emittedEvent);
        } else {
            this.isStopped = true;
            emittedEvent.isPlaying = false;
            this.eventBus.triggerStreamActionEvent(emittedEvent);
        }
    }

    processAndSetImageUrls(messages) {
        let messArray = [];
        for (let mess of messages) {
            messArray.push(this.sanitizer.bypassSecurityTrustUrl(mess.bufferUrl));
        }
        this.imgUrl = null;
        this.imgUrl = messArray;
    }

    get THIS_CLASS() {
        return 'HOME';
    }
}
