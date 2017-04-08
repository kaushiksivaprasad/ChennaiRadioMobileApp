import { Component, ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../../service/websocket';
import { ScheduleService } from '../../service/schedule';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { EventBus } from '../../service/eventbus';
import { NetworkDetectionService } from '../../service/network-detection';
import Utils from '../../utils/utils';
import Config from '../../utils/system-config';


@Component({
    templateUrl: 'home.html'
})
export class Home {
    isStopped = true;
    imgUrl: Array<any> = [];
    adHeight;
    cardImgHeight;

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
    networkStatus = true;

    constructor(private wsService: WebSocketService,
        private scheduleService: ScheduleService,
        private sanitizer: DomSanitizer,
        private platform: Platform,
        private eventBus: EventBus,
        private networkDetectionService: NetworkDetectionService,
        private alertCtrl: AlertController,
        private ref: ChangeDetectorRef) {
        this.adHeight = (platform.height() * .33) + 'px';
        this.cardImgHeight = (platform.height() * .18) + 'px';

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
                console.log(`streamActionEvent obtained from ${event.src} and the value of isPlaying is ${event.isPlaying}`);
                if (event.isPlaying) {
                    this.isStopped = false;
                } else {
                    this.isStopped = true;
                }
                this.ref.detectChanges();
            }
        });
        this.wsService.initiateWebSocket();
        this.scheduleService.getSchedule();

        this.networkDetectionService.networkConnectionStatusEvent.subscribe((event) => {
            let prevStatus = this.networkStatus;
            this.networkStatus = event.networkAvailable;
            if (prevStatus === true && this.networkStatus === false) {
                this.displayNetworkNotAvailablePopup();
            }
        });
    }

    onclick(override = false) {
        if (!!this.networkStatus || override) {
            let emittedEvent = {
                src: this.THIS_CLASS,
                isPlaying: null
            };
            if (this.isStopped) {
                this.isStopped = false;
                emittedEvent.isPlaying = true;
                this.eventBus.triggerStreamActionEvent(emittedEvent);
            } else {
                this.isStopped = true;
                emittedEvent.isPlaying = false;
                this.eventBus.triggerStreamActionEvent(emittedEvent);
            }
        } else {
            this.displayNetworkNotAvailablePopup();
        }
    }

    processAndSetImageUrls(messages) {
        let messArray = [];
        for (let mess of messages) {
            messArray.push(this.sanitizer.bypassSecurityTrustUrl(mess.bufferUrl));
        }
        this.imgUrl = null;
        this.imgUrl = messArray;
        this.triggerUpdateInFullScreenViewer(messArray);
    }

    get THIS_CLASS() {
        return 'HOME';
    }

    openImgInFullScreenViewer(index) {
        let emittedEvent = {
            eventType: Config.FULL_SCREEN_VIEWER_OPEN,
            data: index
        };
        console.log('Home -> img clicked');
        this.eventBus.triggerFullScreenImgViewerEvent(emittedEvent);
    }

    triggerUpdateInFullScreenViewer(messArray) {
        let emittedEvent = {
            eventType: Config.FULL_SCREEN_VIEWER_UPDATE_DATA,
            data: messArray
        };
        this.eventBus.triggerFullScreenImgViewerEvent(emittedEvent);
    }

    onCall() {
        window.open('tel:+19058056535');
    }

    displayNetworkNotAvailablePopup() {
        if (!!!this.networkStatus) {
            let alert = this.alertCtrl.create({
                title: 'Network Disconnected',
                subTitle: 'Please try again later.',
                buttons: [{
                    text: 'Ok',
                    role: 'cancel',
                    handler: () => {
                        if (!this.isStopped) {
                            this.onclick(true);
                        }
                    }
                }]
            });
            alert.present();
        }
    }
}
