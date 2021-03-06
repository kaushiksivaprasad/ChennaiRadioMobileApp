import { Injectable, EventEmitter, Inject} from '@angular/core';
import {Platform} from 'ionic-angular';
import Config from '../utils/system-config';

@Injectable()
export class WebSocketService {
    private ws: WebSocket = null;
    public resourceUrl: String = null;
    public adEvent = new EventEmitter<{ mess: Array<any> }>();
    public eventData = null;

    constructor( @Inject(Platform) public platform: Platform) {
        this.platform.pause.subscribe(evt => {
            console.log('WebSocketService -> pause event');
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
        });
        this.platform.resume.subscribe(evt => {
            console.log('WebSocketService -> resume event');
            if (!this.ws) {
                this.initiateWebSocket();
            }
        });
    }

    initiateWebSocket(): void {
        if (!this.ws && this.resourceUrl) {
            let url = this.resourceUrl;
            // Remove http or https from the url
            if (url.substring(0, 4) === 'http') {
                url = url.replace('http', Config.WS_RESOURCE);
            } else if (url.substring(0, 5) === 'https') {
                url = url.replace('https', Config.WS_RESOURCE);
            }

            this.ws = new WebSocket(url + Config.WS_RESOURCE);

            this.ws.onopen = function () {
                console.log('WebSocketService -> open');
            };
            this.ws.onmessage = (evt: MessageEvent) => {
                var evtMess = evt.data;
                this.eventData = JSON.parse(evtMess);
                this.adEvent.emit(this.eventData);
                console.log('WebSocketService -> MessageEvent recieved');
                // this.triggerListener(event);
            };

            this.ws.onclose =  () => {
                this.ws = null;
                console.log('WebSocketService -> Connection is closed...');
            };
        }
    }

}
