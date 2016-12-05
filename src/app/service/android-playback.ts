import { Injectable, Injector } from '@angular/core';
import { AbstractBasePlayBack } from '../utils/abstract-base-playback';

declare var MusicControls: any;
@Injectable()
export class AndroidPlayBackService extends AbstractBasePlayBack {
    notificationLoaded = false;

    public constructor(private injector: Injector) {
        super(injector);
        console.log('AndroidPlayBackService -> constructor');
    }

    onMediaStopped() {
        // need to be overridden by derived classes
        if (this.notificationLoaded) {
            MusicControls.destroy(e => {
                this.notificationLoaded = false;
            });
        }
    }

    onMediaRunning() {
        if (!this.notificationLoaded) {
            // isPlaying will be true at this point..so dont have to 
            // call MusicControls.updateIsPlaying(true);
            this.createNotification();
        }else {
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
                            MusicControls.updateIsPlaying(false);
                            emittedEvent.isPlaying = false;
                            this.isPlaying = false;
                            console.log('AndroidPlayBackService -> music-controls-pause');
                            this.eventBus.streamActionEvent.emit(emittedEvent);
                            return setTimeout(() => {
                                this.stopAndReleaseMedia();
                            }, 1);
                        case 'music-controls-play':
                            // Do something
                            this.loadMedia();
                            MusicControls.updateIsPlaying(true);
                            emittedEvent.isPlaying = true;
                            this.isPlaying = true;
                            console.log('AndroidPlayBackService -> music-controls-play');
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

}
