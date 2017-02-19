import { Injectable, Injector } from '@angular/core';
import { AbstractBasePlayBack } from '../utils/abstract-base-playback';

declare namespace window {
    var remoteControls: any;
    function resolveLocalFileSystemURL(nativePath: any, cb: any): void;
}
@Injectable()
export class IOSPlayBackService extends AbstractBasePlayBack {
    metaDisplayed = false;
    instance = null;
    public constructor(private injector: Injector) {
        super(injector);
        console.log('IOSPlayBackService -> constructor');
        // listen for the event
        document.addEventListener('remote-event', (event: any) => {
            // {"isTrusted":false,"remoteEvent":{"subtype":"pause"}}
            console.log('IOSPlayBackService -> remoteEvent' + JSON.stringify(event));
            if (event && event.remoteEvent && event.remoteEvent.subtype) {
                let emittedEvent = {
                    src: this.THIS_CLASS,
                    isPlaying: null
                };
                switch (event.remoteEvent.subtype) {
                    case 'play':
                        this.loadMedia();
                        emittedEvent.isPlaying = true;
                        this.isPlaying = true;
                        console.log('IOSPlayBackService -> play');
                        this.eventBus.streamActionEvent.emit(emittedEvent);
                        break;
                    case 'pause':
                        emittedEvent.isPlaying = false;
                        this.isPlaying = false;
                        console.log('IOSPlayBackService -> pause');
                        this.eventBus.streamActionEvent.emit(emittedEvent);
                        this.stopAndReleaseMedia();
                }
            }
        });
    }

    onMediaStopped() {
        this.displayMeta(true);
    }

    onMediaRunning() {
        console.log('IOSPlayBackService -> onMediaRunning');
        this.displayMeta(false);
    }

    onNewScheduleRecieved() {
        this.displayMeta(false);
    }

    displayMeta(flush) {
        let artist = this.artist;
        let title = this.title;
        if (typeof cordova !== 'undefined' && cordova) {
            let url = cordova.file.applicationDirectory + 'www/assets/img/music_cover_art.png';
            window.resolveLocalFileSystemURL(url, (entry) => {
                let img = entry.toInternalURL();
                if (flush) {
                    artist = '';
                    title = '';
                    img = '';
                }
                var params = [artist, title, title, img, '', ''];
                console.log('final image url IOSPlayBackService -> url ' + img);
                window.remoteControls.updateMetas((success) => {
                    console.log('IOSPlayBackService -> updateMeta ' + success);
                    this.metaDisplayed = true;

                }, (fail) => {
                    console.log('IOSPlayBackService -> updateMeta ' + fail);

                }, params);
            });
        }
    }
}
