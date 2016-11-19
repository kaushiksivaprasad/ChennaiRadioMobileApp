import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventBus {
    public streamActionEvent = new EventEmitter<{ src: string, isPlaying: boolean }>();
    public signupSuccessfulEvent = new EventEmitter<{ emailId: string, password: string }>();
    public resourceUrl: string;

    constructor() {
    }

    triggerStreamActionEvent(event: { src: string, isPlaying: boolean }): void {
        this.streamActionEvent.emit(event);
    }

    triggerSignupSuccessfulEvent(userCredentials: { emailId: string, password: string }): void {
        this.signupSuccessfulEvent.emit(userCredentials);
    }

}
