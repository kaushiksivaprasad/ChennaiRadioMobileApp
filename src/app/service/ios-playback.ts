import { Injectable, Injector } from '@angular/core';
import { AbstractBasePlayBack } from '../utils/abstract-base-playback'


declare module window {
    var remoteControls: any;
}
@Injectable()
export class IOSPlayBackService extends AbstractBasePlayBack {
    metaDisplayed = false;
    public constructor(private injector: Injector) {
        super(injector);
        console.log('IOSPlayBackService -> constructor');
        document.addEventListener("remote-event", (event) => {
            console.log('IOSPlayBackService -> remote-event : ' + JSON.stringify(event));
        });
    }

    onMediaStopped() {
        this.displayMeta(true);
    }

    onMediaRunning() {
        this.displayMeta(false);
    }

    onNewScheduleRecieved() {
        this.displayMeta(false);
    }

    displayMeta(flush) {
        let artist = this.artist;
        let title = this.title;
        let img = 'assets/img/music_cover_art.png';
        if (flush) {
            artist = '';
            title = '';
            img = ''
        }
        var params = [artist, title, '', img, '', ''];
        window.remoteControls.updateMetas((success) => {
            console.log(success);
            this.metaDisplayed = true;

        }, (fail) => {
            console.log(fail);

        }, params);
    }
}