import { Injectable, OnInit } from '@angular/core';
import {RegistrationService} from '../service/Registration'

@Injectable()
export class WebSocketService extends OnInit {
    private componentList: Array<any>;
    private ws = null;

    constructor(private regService: RegistrationService) {
        super();

    }
    ngOnInit() {
        //called after the constructor and called  after the first ngOnChanges() 
        this.initiateWebSocket();
    }
    addListener(componentInstance: any): void {
        this.componentList.push(componentInstance);
    }


    triggerListener(event: any): void {
        for (let component of this.componentList) {
            component.onEventRecieved(event);
        }
    }
    initiateWebSocket(): void {
        let url = this.regService.getResourceUrl();

        // Remove http or https from the url
        if (url.substring(0, 4) == "http") {
            url = url.replace("http", "");
        } else if (url.substring(0, 5) == "https") {
            url = url.replace("https", "");
        }

        this.ws = new WebSocket("ws://" + url + "ws");

        this.ws.onopen = function () {
            // Web Socket is connected, send data using send()
            // ws.send("Message to send");
            console.log("open");
        };
        this.ws.onmessage = evt => {

            //append the event data into the component list
            this.triggerListener(event);

        };

        this.ws.onclose = function () {
            // websocket is closed.

            setTimeout(function () {
                this.ws = null;
            }, 1);
            console.log("Connection is closed...");
        };
    }

}
