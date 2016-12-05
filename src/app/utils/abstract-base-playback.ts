import { Injector } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { EventBus } from '../service/eventbus';
import { ScheduleService } from '../service/schedule';
import Utils from './utils';
import Config from '../utils/system-config';

export class AbstractBasePlayBack {
    isPlaying = false;
    protected eventBus: EventBus;
    protected loadingController: LoadingController;
    protected scheduleService: ScheduleService;
    prevStatus: number = -1;
    loaderInstance = null;
    timer = null;
    counter = 0;
    media: any = null;
    title = 'Chennai Radio Stream';
    artist = 'Chennai Radio';

    public constructor(injector: Injector) {
        this.eventBus = injector.get(EventBus);
        this.loadingController = injector.get(LoadingController);
        this.scheduleService = injector.get(ScheduleService);
        console.log('AbstractBasePlayBack -> constructor');
        if (this.scheduleService.schedules != null) {
            let program = Utils.extractFirstProgramFromSchedule(this.scheduleService.schedules);
            this.setScheduleInfo(program);
        }
        this.scheduleService.scheduleRecieveEvent.subscribe(schedules => {
            let program = Utils.extractFirstProgramFromSchedule(this.scheduleService.schedules);
            this.setScheduleInfo(program);
        });
        this.eventBus.streamActionEvent.subscribe(event => {
            if (event.src !== this.THIS_CLASS) {
                if (typeof Media !== 'undefined' && Media) {
                    if (event.isPlaying) {
                        this.isPlaying = true;
                        this.loadMedia();
                    } else {
                        this.isPlaying = false;
                        this.stopAndReleaseMedia();
                    }
                }
            }
        });
    }

    loadMedia() {
        this.prevStatus = -1;
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.counter = 0;
        this.media = new Media(Config.STREAM_URL + Date.now(), function () {
            console.log('Playing audio');
        }, null, status => {
            this.onMediaStateChange(status);
        });
        this.media.play();
    }

    protected stopAndReleaseMedia() {
        if (this.media) {
            console.log('stopping stream');
            this.media.stop();
            this.media.release();
            this.media = null;
            this.onMediaStopped();
        }
    }

    setScheduleInfo(program) {
        if (program) {
            this.title = program.name;
            this.artist = program.hostedBy;
        } else {
            this.title = 'Chennai Radio Stream';
            this.artist = 'Chennai Radio';
        }
        this.onNewScheduleRecieved();
    }

    onMediaStateChange(status) {
        if (status === Media.MEDIA_STARTING) {
            this.onMediaStarting();
            this.counter = 0;
            this.prevStatus = status;
            this.loaderInstance = this.loadingController.create({
                content: 'Loading...'
            });
            this.loaderInstance.present();
        } else if (status === Media.MEDIA_RUNNING) {
            console.log('home-wrapper.html.ts  -> running');
            this.onMediaRunning();
            let tempPrevStatus = this.prevStatus;
            this.prevStatus = status;
            if (tempPrevStatus === Media.MEDIA_STARTING && this.loaderInstance) {
                // there is a delay for the initial burst to start..and hence
                // we show the loader
                this.loaderInstance.dismiss();
            } else if (tempPrevStatus === Media.MEDIA_PAUSED) {
                if (this.counter > 3) {
                    // when the user gets a call
                    this.stopAndReleaseMedia();
                    clearInterval(this.timer);
                    this.counter = 0;
                    return this.loadMedia();
                } else {
                    // when the user gets a notifcation or message
                    clearInterval(this.timer);
                    this.counter = 0;
                }
            }
        } else if (status === Media.MEDIA_PAUSED) {
            this.onMediaPaused();
            this.prevStatus = status;
            console.log('home-wrapper.html.ts  -> paused');
            this.timer = setInterval(() => {
                this.counter += 1;
            }, 1000);
        }
    }

    protected onMediaStopped() {
        // need to be overridden by derived classes
    }

    protected onMediaStarting() {
        // need to be overridden by derived classes
    }

    protected onMediaRunning() {
        // need to be overridden by derived classes
    }

    protected onMediaPaused() {
        // need to be overridden by derived classes
    }

    protected onNewScheduleRecieved() {
        // need to be overridden by derived classes
    }

    get THIS_CLASS() {
        return 'BASE_PLAYBACK_SERVICE';
    }
}
