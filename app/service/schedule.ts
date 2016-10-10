import { Injectable, EventEmitter} from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import Config from '../utils/system-config';
import * as moment from 'moment';

@Injectable()
export class ScheduleService {
    private timeout = null;
    public resourceUrl: String = null;
    public scheduleRecieveEvent = new EventEmitter<any>();
    constructor(public http: Http) {
    }
    triggerFetchAtEndofSchedule(schedules): void {
        // All time is converted to GMT
        if (schedules[0] && schedules[0].programs[0]) {
            let endTimeInHour: number = + schedules[0].programs[0].endTimeInHour;
            let endTimeInMinues: number = + schedules[0].programs[0].endTimeInMinutes;

            let currentTime = moment().utc().valueOf();
            let futureTime = moment().utc().hours(endTimeInHour).minutes(endTimeInMinues).valueOf();
            let diffTime = futureTime - currentTime;

            this.timeout = setTimeout(() => {
                clearTimeout(this.timeout);
                this.getSchedule();
            }, diffTime);
            this.scheduleRecieveEvent.emit(schedules);
        }
    }


    getSchedule(): void {
        if (this.resourceUrl) {
            let url: string = this.resourceUrl + Config.SCHEDULE_RESOURCE;
            this.http.get(url)
                .toPromise()
                .then(response => {
                    let schedules = response.json();
                    console.log('ScheduleService -> scheduleObtained'+JSON.stringify(schedules));
                    this.triggerFetchAtEndofSchedule(schedules);
                })
                .catch(this.handleError);
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.json());
    }
}
