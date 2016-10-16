import {Component} from '@angular/core';
import Utils from '../../utils/utils';
import {ScheduleService} from '../../service/schedule';
import {DomSanitizationService} from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
    templateUrl: 'build/pages/schedules/schedules.html'
})
export class Schedules {
    private programs: Array<any> = [];
    private imgUrl: Array<any> = [
        "img/schedule1-min.jpg",
        "img/schedule2-min.jpg",
        "img/schedule3-min.jpg",
        "img/schedule4-min.jpg",
        "img/schedule5-min.jpg",
        "img/schedule6-min.jpg",
        "img/schedule7-min.jpg"];

    constructor(private scheduleService: ScheduleService, private sanitizer: DomSanitizationService) {
        if (this.scheduleService.schedules != null) {
            this.setSchedule(this.scheduleService.schedules);
        }
        this.scheduleService.scheduleRecieveEvent.subscribe(schedules => {
            this.setSchedule(schedules);
        });
    }

    setSchedule(schedules) {
        let imgcount = 0;
        for (var sh = 0; sh < schedules.length; sh++) {
            for (var sp = 0; sp < schedules[sh].programs.length; sp++) {
                let program = schedules[sh].programs[sp];
                let startTime = moment().utc().hours(program.startTimeInHour).
                    minutes(program.startTimeInMinutes).local().format('h:mm a');
                let endTime = moment().utc().hours(program.endTimeInHour).
                    minutes(program.endTimeInMinutes).local().format('h:mm a');
                if (imgcount === this.imgUrl.length) {
                    imgcount = 0;
                }
                let temp = {
                    name: program.programName,
                    hostedBy: program.hostedBy,
                    programImg: this.sanitizer.bypassSecurityTrustUrl(this.imgUrl[imgcount]),
                    time: startTime + ' - ' + endTime
                };
                this.programs.push(temp);
                imgcount++;
            }
        }
    }
}
