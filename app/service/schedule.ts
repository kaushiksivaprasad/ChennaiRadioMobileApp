import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import Config from '../utils/system-config';
import * as moment from 'moment';

@Injectable()
export class ScheduleService {
    public schedules = null;
    private timeout = null;
    public resourceUrl: String = null;
    public scheduleRecieveEvent = new EventEmitter<any>();
    constructor(public http: Http) {
    }
    triggerFetchAtEndofSchedule(): void {
        // All time is converted to GMT
        if (this.schedules[0] && this.schedules[0].programs[0]) {
            let endTimeInHour: number = + this.schedules[0].programs[0].endTimeInHour;
            let endTimeInMinues: number = + this.schedules[0].programs[0].endTimeInMinutes;
            let dayToSet = this.schedules[0].dayPlayed;
            let currentDay = moment().utc().day();
            if (currentDay > dayToSet) {
                dayToSet = dayToSet + 1;
            }
            let currentTime = moment().utc().valueOf();
            let futureTime = moment().utc().day(dayToSet).hours(endTimeInHour).minutes(endTimeInMinues).valueOf();
            let diffTime = futureTime - currentTime;
            if (diffTime >= 0) {
                if (diffTime === 0) {
                    // give one minute delay before fetching again
                    diffTime = 1000 * 60;
                }

                this.timeout = setTimeout(() => {
                    clearTimeout(this.timeout);
                    this.getSchedule();
                }, diffTime);
            }
        }
    }


    getSchedule(): void {
        if (this.resourceUrl) {
            let url: string = this.resourceUrl + Config.SCHEDULE_RESOURCE;
            this.http.get(url)
                .toPromise()
                .then(response => {
                    let schedules = response.json();
                    if (schedules && schedules.length > 0) {
                        this.schedules = response.json();
                        console.log('ScheduleService -> scheduleObtained' + JSON.stringify(this.schedules));
                        this.triggerFetchAtEndofSchedule();
                        this.scheduleRecieveEvent.emit(this.schedules);
                    }
                })
                .catch(this.handleError);
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.json());
    }
}
