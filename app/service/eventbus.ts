import { Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class EventBus {
    public streamActionEvent = new EventEmitter<boolean>();
    public resourceUrl: string;

    constructor() {
    }

    triggerStreamActionEvent(val: boolean): void {
        this.streamActionEvent.emit(val);
    }

}
