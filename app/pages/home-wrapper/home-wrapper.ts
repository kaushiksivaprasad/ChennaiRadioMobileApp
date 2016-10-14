import {Component} from '@angular/core';
import {Home} from '../home/home';
import {Schedules} from '../schedules/schedules';
import {EventBus} from '../../service/eventbus';
import Config from '../../utils/system-config';
import {DomSanitizationService} from '@angular/platform-browser';

declare var Media: any;

@Component({
    templateUrl: 'build/pages/home-wrapper/home-wrapper.html',
})
export class HomeWrapper {
    nowPlaying = Home;
    schedule = Schedules;
    url: any = '';
    media: any = null;
    public constructor(private eventBus: EventBus,
        private sanitizer: DomSanitizationService) {
        this.eventBus.streamActionEvent.subscribe(val => {
            if (val) {
                this.media = new Media(this.eventBus.resourceUrl + Config.STREM_RESOURCE + '/' + Date.now(), function () {
                    console.log("Playing audio");
                });
                this.media.play();
                // let url = this.sanitizer.bypassSecurityTrustUrl(
                //     this.eventBus.resourceUrl + Config.STREM_RESOURCE);
                // this.url = url;
            } else {
                this.media.stop();
                this.media.release();
                this.media = null;
                // this.url = '';
                // let element: any = document.getElementById('audioElement');
                // element.load();
            }
        });

    }
}
