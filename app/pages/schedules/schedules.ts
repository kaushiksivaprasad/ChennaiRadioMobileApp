import {Component} from '@angular/core';
import Utils from '../../utils/utils';
import {ScheduleService} from '../../service/schedule';
import {DomSanitizationService} from '@angular/platform-browser';
import * as moment from 'moment';
import * as tz from 'moment-timezone';
@Component({
    templateUrl: 'build/pages/schedules/schedules.html'
})
export class Schedules {
    private programs: Array<any> = [];
    private imgUrl: Array<any> = ["img/schedule1-min.jpg", "img/schedule2-min.jpg", "img/schedule3-min.jpg", "img/schedule4-min.jpg"];

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
        let programCount = 0;
        let timezoneOffset=moment.tz.guess();
        for (var sh = 0; sh < schedules.length; sh++) {
            for (var sp = 0; sp < schedules[sh].programs.length; sp++) {
                this.programs[programCount]={};
                this.programs[programCount].name = schedules[sh].programs[sp].programName;
                this.programs[programCount].hostedBy = schedules[sh].programs[sp].hostedBy;
                this.programs[programCount].time = schedules[sh].programs[sp].startTimeInHour.moment.tz(timezoneOffset).format('H')+":"+schedules[sh].programs[sp].startTimeInMinutes.moment.tz(timezoneOffset).format('mm');
                
                if (imgcount === this.imgUrl.length) {
                    imgcount = 0;
                }
                this.programs[programCount].programImg = this.sanitizer.bypassSecurityTrustUrl(this.imgUrl[imgcount]);
                imgcount++;
                programCount++;
            }
        }
    }
}
