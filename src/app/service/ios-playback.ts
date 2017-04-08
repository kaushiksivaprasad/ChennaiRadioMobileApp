import { Injectable, Injector } from '@angular/core';
import { AbstractBasePlayBack } from '../utils/abstract-base-playback';
import { NetworkDetectionService } from '../service/network-detection';

declare var MusicControls: any;
@Injectable()
export class IOSPlayBackService extends AbstractBasePlayBack {
    notificationLoaded = false;
    networkStatus = true;
    networkDetectionService: NetworkDetectionService = null;
    public constructor(private injector: Injector) {
        super(injector);
        this.networkDetectionService = injector.get(NetworkDetectionService);
        this.networkDetectionService.networkConnectionStatusEvent.subscribe((event) => {
            this.networkStatus = event.networkAvailable;
        });
        console.log('IOSPlayBackService -> constructor');
    }

    onMediaStopped() {
        if (this.notificationLoaded) {
            MusicControls.updateIsPlaying(false);
        }
    }
    onNotificationDestroy() {
        this.onMediaStopped();
    }

    onMediaRunning() {
        if (!this.notificationLoaded) {
            // isPlaying will be true at this point..so dont have to 
            // call MusicControls.updateIsPlaying(true);
            this.createNotification();
        } else {
            // this needs to be called because when the user clicks the play button from
            // the notification and the app is in the background, 
            // we need to manually toggle notification icon to playing and not have to create a notification
            // again
            MusicControls.updateIsPlaying(true);
        }
    }

    onNewScheduleRecieved() {
        if (this.notificationLoaded) {
            this.createNotification();
        }
    }

    createNotification() {
        if (typeof MusicControls !== 'undefined' && MusicControls) {
            MusicControls.create({
                track: this.title,		                // optional, default : '' 
                artist: this.artist,					// optional, default : '' 
                cover: this.artistImgUrl,		// optional, default : nothing 
                // cover : cordova.file.applicationDirectory + "www/assets/img/music_cover_art.png",
                // cover: 'assets/img/music_cover_art.png',
                isPlaying: this.isPlaying,						// optional, default : true 
                hasPrev: false,		// show previous button, optional, default: true 
                hasNext: false,		// show next button, optional, default: true 
                album: 'Chennai Radio'
            }, (e) => {
                console.log('IOSPlayBackService -> onSuccess create notif');
                this.notificationLoaded = true;
            });
            let emittedEvent = {
                src: this.THIS_CLASS,
                isPlaying: null
            };
            let eventListener = (action): any => {
                switch (action) {
                    case 'music-controls-pause':
                        if (!!this.networkStatus) {
                            MusicControls.updateIsPlaying(false);
                            emittedEvent.isPlaying = false;
                            this.isPlaying = false;
                            console.log('IOSPlayBackService -> music-controls-pause');
                            this.eventBus.streamActionEvent.emit(emittedEvent);
                            return this.stopAndReleaseMedia();
                        }
                        break;
                    case 'music-controls-play':
                        if (!!this.networkStatus) {
                            MusicControls.updateIsPlaying(true);
                            emittedEvent.isPlaying = true;
                            this.isPlaying = true;
                            console.log('IOSPlayBackService -> music-controls-play');
                            this.eventBus.streamActionEvent.emit(emittedEvent);
                            return this.loadMedia();
                        }
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
            this.notificationLoaded = true;
        }
        return null;
    }

}
