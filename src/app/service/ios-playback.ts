import { Injectable, Injector } from '@angular/core';
import { AbstractBasePlayBack } from '../utils/abstract-base-playback'

declare module window {
    var remoteControls: any;
    function resolveLocalFileSystemURL(nativePath: any, cb: any): void;
}
// declare var RemoteCmdPlayingInfo: any;
// declare var RemoteCommand: any;
declare var cordova: any;
@Injectable()
export class IOSPlayBackService extends AbstractBasePlayBack {
    metaDisplayed = false;
    instance = null;
    public constructor(private injector: Injector) {
        super(injector);
        console.log('IOSPlayBackService -> constructor');
        //listen for the event
        document.addEventListener("remote-event", (event: any) => {
            //{"isTrusted":false,"remoteEvent":{"subtype":"pause"}}
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
        })
        // // Disable buttons
        // RemoteCommand.enabled('nextTrack', false);
        // RemoteCommand.enabled('previousTrack', false);

        // // Start listening to all the remote commands
        // RemoteCommand.on('command', (command) => {
        //     console.log('IOSPlayBackService -> remote-event', command);
        //     let emittedEvent = {
        //         src: this.THIS_CLASS,
        //         isPlaying: null
        //     };
        //     switch (command) {
        //         case 'play':
        //             //"value" is zero for this event 
        //             this.loadMedia();
        //             emittedEvent.isPlaying = true;
        //             this.isPlaying = true;
        //             console.log('IOSPlayBackService -> play');
        //             this.eventBus.streamActionEvent.emit(emittedEvent);
        //             break;
        //         case 'pause':
        //             emittedEvent.isPlaying = false;
        //             this.isPlaying = false;
        //             console.log('IOSPlayBackService -> pause');
        //             this.eventBus.streamActionEvent.emit(emittedEvent);
        //             return setTimeout(() => {
        //                 this.stopAndReleaseMedia()
        //             }, 10);
        //     }
        // });
    }

    onMediaStopped() {
        // if (this.instance) {
        //     this.instance.release(true);
        // }
        this.displayMeta(true);
    }

    onMediaRunning() {
        console.log("IOSPlayBackService -> onMediaRunning");
        this.displayMeta(false);
        // this.displayMeta();
    }

    onNewScheduleRecieved() {
        this.displayMeta(false);
        // this.displayMeta();
    }

    displayMeta(flush) {
        let artist = this.artist;
        let title = this.title;

        let url = cordova.file.applicationDirectory + 'www/assets/img/music_cover_art.png';
        window.resolveLocalFileSystemURL(url, (entry) => {
            let img = entry.toInternalURL();
            if (flush) {
                artist = '';
                title = '';
                img = ''
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

    // displayMeta() {
    //     let artist = this.artist;
    //     let title = this.title;
    //     let url = cordova.file.applicationDirectory + 'www/assets/img/music_cover_art.png';
    //     console.log('IOSPlayBackService -> url path :' + url);
    //     window.resolveLocalFileSystemURL(url, (entry) => {
    //         console.log('cdvfile URI: ' + entry.toInternalURL());
    //         let img = entry.toInternalURL();
    //         var info = {
    //             'title': title,
    //             'albumTitle': artist,
    //             'artwork': img,
    //             /*set these to 1 if you want to handle the next/previous track events. 0: do not handle these events*/
    //             'receiveNextTrackEvent': 0,
    //             'receivePrevTrackEvent': 0
    //         };
    //         if (this.instance) {
    //             this.instance.updateInfo(info);
    //         }
    //         else {
    //             this.instance = new RemoteCmdPlayingInfo(info, (event) => {
    //                 let emittedEvent = {
    //                     src: this.THIS_CLASS,
    //                     isPlaying: null
    //                 };
    //                 switch (event) {
    //                     case RemoteCmdPlayingInfo.EVENT_PLAY:
    //                         //"value" is zero for this event 
    //                         this.loadMedia();
    //                         emittedEvent.isPlaying = true;
    //                         this.isPlaying = true;
    //                         console.log('IOSPlayBackService -> play');
    //                         this.eventBus.streamActionEvent.emit(emittedEvent);
    //                         break;
    //                     case RemoteCmdPlayingInfo.EVENT_PAUSE:
    //                         console.log("IOSPlayBackService -> pause");
    //                         //"value" is zero for this event 
    //                         emittedEvent.isPlaying = false;
    //                         this.isPlaying = false;
    //                         console.log('IOSPlayBackService -> pause');
    //                         this.eventBus.streamActionEvent.emit(emittedEvent);
    //                         return setTimeout(() => {
    //                             this.stopAndReleaseMedia()
    //                         }, 10);
    //                 }//switch 
    //             });
    //         };
    //     });

    // }
}