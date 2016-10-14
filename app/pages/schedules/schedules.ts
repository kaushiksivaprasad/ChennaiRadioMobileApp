import {Component} from '@angular/core';
import Utils from '../../utils/utils';
import {ScheduleService} from '../../service/schedule';
import {DomSanitizationService} from '@angular/platform-browser';

@Component({
    templateUrl: 'build/pages/schedules/schedules.html'
})
export class Schedules {
    private programs: Array<any> = [];
    private imgUrl: Array<any> = ["img/schedule1-min.jpg", "img/schedule2-min.jpg", "img/schedule3-min.jpg", "img/schedule4-min.jpg"];

    constructor(private scheduleService: ScheduleService,private sanitizer: DomSanitizationService) {
        this.scheduleService.scheduleRecieveEvent.subscribe(schedules => {
            let imgcount = 0;
            for (var sh = 0; sh = schedules.length; sh++) {
                this.programs[sh].name = schedules[sh].programName;
                this.programs[sh].hostedBy = schedules[sh].hostedBy;
                this.programs[sh].time = schedules[sh].time;                
                if (imgcount === this.imgUrl.length) {
                    imgcount = 0;
                }
                this.programs[sh].programImg = this.sanitizer.bypassSecurityTrustUrl(this.imgUrl[imgcount]);
                imgcount++;
            }

        });

    }
}
