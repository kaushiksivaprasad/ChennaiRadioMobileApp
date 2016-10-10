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
    constructor(private http: Http, private regService: RegistrationService) {
        this.schedule = this.getSchedule();
    }

    checkEndOfSchedule(): void {

        // All time is converted to GMT
        
        let endTimeInHour =this.schedule[0].programs.endTimeInHour;
        let endTimeInMinues =this.schedule[0].programs.endTimeInMinutes;
        
        
        let currentTimeInHour = moment().utc().format('H');
        let currentTimeInMinutes = new Date().getMinutes(); 
      

    }


    getSchedule(): Promise<Response> {

        let url: string = Config.WS_URL + this.regService.getResourceUrl(); +"/schedule";
        return this.http.get(url)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.json());
        // return new 
        // Promise.reject(error.message || error);
    }



}
