import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import Config from '../utils/system-config'
import {User} from '../models/user'
import {RegistrationService} from '../service/Registration'
import moment = require("moment");

@Injectable()
export class ScheduleService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private schedule = null;
    private componentList: Array<any>;
    constructor(private http: Http, private regService: RegistrationService) {
        this.getSchedule();
    }
    addListener(schedule: any): void {
        this.componentList.push(schedule);
    }


    triggerListener(schedule: any): void {
        for (let component of this.componentList) {
            component.onScheduleRecieved(schedule);
        }
    }
    checkEndOfSchedule(): void {

        // All time is converted to GMT
        let updateScheduleInHour: any = null;
        let updateScheduleInMinutes: any = null;

        let endTimeInHour: any = this.schedule[0].programs.endTimeInHour;
        let endTimeInMinues: any = this.schedule[0].programs.endTimeInMinutes;

        let currentTimeInHour: any = moment().utc().format('H');
        let currentTimeInMinutes: any = moment().utc().format('m');


        updateScheduleInHour = (endTimeInHour - currentTimeInHour) * 60 * 60000; // hours to milliseconds
        updateScheduleInMinutes = (endTimeInMinues - currentTimeInMinutes) * 60000; // minutes to milliseconds

        setTimeout(() => {
            this.getSchedule();
        }, updateScheduleInHour + updateScheduleInMinutes);


    }


    getSchedule(): void {

        let url: string = Config.WS_URL + this.regService.getResourceUrl(); +"/schedule";
        this.http.get(url)
            .toPromise()
            .then(response => {
                this.schedule = response.json();
                this.checkEndOfSchedule();
            })
            .catch(this.handleError);
        // this.addListener(this.schedule);

    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.json());
        // return new 
        // Promise.reject(error.message || error);
    }



}
