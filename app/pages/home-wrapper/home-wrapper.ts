import {Component} from '@angular/core';
import {Home} from '../home/home';
import {Schedules} from '../schedules/schedules';
import {EventBus} from '../../service/eventbus';
import Config from '../../utils/system-config';
import {DomSanitizationService} from '@angular/platform-browser';
import {LoadingController} from 'ionic-angular';

declare var Media: any;

@Component({
    templateUrl: 'build/pages/home-wrapper/home-wrapper.html',
})
export class HomeWrapper {
    nowPlaying = Home;
    schedule = Schedules;
    url: any = '';
    media: any = null;
    prevStatus: number = -1;
    loaderInstance = null;
    public constructor(private eventBus: EventBus,
        private sanitizer: DomSanitizationService,
        private loadingController: LoadingController) {
        this.eventBus.streamActionEvent.subscribe(val => {
            if (val) {
                let loadMedia = () => {
                    this.prevStatus = -1;
                    this.media = new Media(this.eventBus.resourceUrl + Config.STREM_RESOURCE + '/' + Date.now(), function () {
                        console.log('Playing audio');
                    }, null, (status) => {
                        if (status === Media.MEDIA_STARTING) {
                            this.prevStatus = status;
                            this.loaderInstance = this.loadingController.create({
                                content: 'Loading...'
                            });
                            this.loaderInstance.present();
                        } else if (status === Media.MEDIA_RUNNING) {
                            console.log('home-wrapper.html.ts  -> running');
                            if (this.prevStatus === Media.MEDIA_STARTING && this.loaderInstance) {
                                this.loaderInstance.dismiss();
                            } else if (this.prevStatus === Media.MEDIA_PAUSED) {
                                this.media.stop();
                                this.media.release();
                                this.media = null;
                                return loadMedia();
                            }
                            this.prevStatus = status;
                        } else if (status === Media.MEDIA_PAUSED) {
                            this.prevStatus = status;
                            console.log('home-wrapper.html.ts  -> paused');
                        }
                    });
                    this.media.play();
                };
                loadMedia();
                // let url = this.sanitizer.bypassSecurityTrustUrl(
                //     this.eventBus.resourceUrl + Config.STREM_RESOURCE);
                // this.url = url;
            } else {
                if (this.media) {
                    this.media.stop();
                    this.media.release();
                    this.media = null;
                }
            }
        });

    }
}
