import { Injectable, EventEmitter } from '@angular/core';
import { Network } from '@ionic-native/network';

@Injectable()
export class NetworkDetectionService {
    networkAvailable = false;
    lastEventSent: { networkAvailable: boolean } = null;
    networkConnectionStatusEvent = new EventEmitter<{ networkAvailable: boolean }>();

    constructor(private network: Network) {
        this.network.onDisconnect().subscribe(() => {
            console.log('NetworkDetectionService -> network was disconnected :-(');
            this.networkAvailable = false;
            this.lastEventSent = {
                networkAvailable: this.networkAvailable
            };
            this.networkConnectionStatusEvent.emit(this.lastEventSent);
        });
        this.network.onConnect().subscribe(() => {
            console.log('NetworkDetectionService -> network was connected :-(');
            this.networkAvailable = true;
            this.lastEventSent = {
                networkAvailable: this.networkAvailable
            };
            this.networkConnectionStatusEvent.emit(this.lastEventSent);
        });
    }
}
