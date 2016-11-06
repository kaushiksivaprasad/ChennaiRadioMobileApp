import { Component } from '@angular/core';
import { Home } from '../home/home';
import { Schedules } from '../schedules/schedules';
import { EventBus } from '../../service/eventbus';
import Config from '../../utils/system-config';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from 'ionic-angular';
import { ScheduleService } from '../../service/schedule';
import Utils from '../../utils/utils';

declare var Media: any;
declare var MusicControls: any;
declare var cordova: any;

@Component({
    templateUrl: 'home-wrapper.html',
})
export class HomeWrapper {
    nowPlaying = Home;
    schedule = Schedules;
    url: any = '';
    media: any = null;
    prevStatus: number = -1;
    loaderInstance = null;
    timer = null;
    counter = 0;
    title = 'Chennai Radio Stream';
    artist = 'Chennai Radio';
    notificationLoaded = false;
    isPlaying = false;

    public constructor(private eventBus: EventBus,
        private sanitizer: DomSanitizer,
        private loadingController: LoadingController,
        private scheduleService: ScheduleService) {
        if (this.scheduleService.schedules != null) {
            this.setNewScheduleInNotification(this.scheduleService.schedules);
        }
        this.scheduleService.scheduleRecieveEvent.subscribe(schedules => {
            this.setNewScheduleInNotification(schedules);
        });
        this.eventBus.streamActionEvent.subscribe(event => {
            if (event.src !== this.THIS_CLASS) {
                if (typeof Media !== 'undefined' && Media) {
                    if (event.isPlaying) {
                        this.isPlaying = true;
                        this.loadMedia();
                        // let url = this.sanitizer.bypassSecurityTrustUrl(
                        //     this.eventBus.resourceUrl + Config.STREM_RESOURCE);
                        // this.url = url;
                    } else {
                        this.isPlaying = false;
                        this.stopAndReleaseMedia();
                        if (this.notificationLoaded) {
                            MusicControls.destroy(e => {
                                this.notificationLoaded = false;
                            });
                        }
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

    createNotification() {
        if (typeof MusicControls !== 'undefined' && MusicControls) {
            MusicControls.create({
                track: this.title,		                // optional, default : '' 
                artist: this.artist,					// optional, default : '' 
                cover: 'assets/img/music_cover_art.png',		// optional, default : nothing 
                isPlaying: this.isPlaying,						// optional, default : true 
                hasPrev: false,		// show previous button, optional, default: true 
                hasNext: false		// show next button, optional, default: true 
            }, (e) => {
                this.notificationLoaded = true;
                let emittedEvent = {
                    src: this.THIS_CLASS,
                    isPlaying: null
                };
                let eventListener = (action) => {
                    switch (action) {
                        case 'music-controls-pause':
                            // Do something
                            this.stopAndReleaseMedia();
                            MusicControls.updateIsPlaying(false);
                            emittedEvent.isPlaying = false;
                            this.isPlaying = false;
                            this.eventBus.streamActionEvent.emit(emittedEvent);
                            break;
                        case 'music-controls-play':
                            // Do something
                            this.loadMedia();
                            MusicControls.updateIsPlaying(true);
                            emittedEvent.isPlaying = true;
                            this.isPlaying = true;
                            this.eventBus.streamActionEvent.emit(emittedEvent);
                            break;
                        default:
                            break;
                    }
                };
                // Register callback
                MusicControls.subscribe(eventListener);
                // Start listening for events
                // The plugin will run the events function each time an event is fired
                MusicControls.listen();
            });
        }
        return null;
    }

    onMediaStateChange(status) {
        if (status === Media.MEDIA_STARTING) {
            this.counter = 0;
            this.prevStatus = status;
            this.loaderInstance = this.loadingController.create({
                content: 'Loading...'
            });
            this.loaderInstance.present();
        } else if (status === Media.MEDIA_RUNNING) {
            console.log('home-wrapper.html.ts  -> running');
            if (!this.notificationLoaded) {
                // isPlaying will be true at this point..so dont have to 
                // call MusicControls.updateIsPlaying(true);
                this.createNotification();
            } else {
                // this needs to be called because when the user clicks the play button from
                // the notification, we need to manually toggle notification icon to playing
                MusicControls.updateIsPlaying(true);
            }
            if (this.prevStatus === Media.MEDIA_STARTING && this.loaderInstance) {
                // there is a delay for the initial burst to start..and hence
                // we show the loader
                this.loaderInstance.dismiss();
            } else if (this.prevStatus === Media.MEDIA_PAUSED) {
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
            this.prevStatus = status;
        } else if (status === Media.MEDIA_PAUSED) {
            this.prevStatus = status;
            console.log('home-wrapper.html.ts  -> paused');
            this.timer = setInterval(() => {
                this.counter += 1;
            }, 1000);
        }
    }

    stopAndReleaseMedia() {
        if (this.media) {
            this.media.stop();
            this.media.release();
            this.media = null;
        }
    }

    setNewScheduleInNotification(schedules) {
        let program = Utils.extractFirstProgramFromSchedule(schedules);
        if (program) {
            this.title = program.name;
            this.artist = program.hostedBy;
        } else {
            this.title = 'Chennai Radio Stream';
            this.artist = 'Chennai Radio';
        }
        if (this.notificationLoaded) {
            this.createNotification();
        }
    }

    get THIS_CLASS() {
        return 'HOME_WRAPPER';
    }
}
