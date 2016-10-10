import {Component, OnInit} from '@angular/core';
import Config from '../../utils/system-config'
import Utils from '../../utils/utils';


@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class Home extends OnInit {
    private imgList: Array<any>;
    program = {
        name: null,
        hostedBy: null,
        artistImgUrl: null
    };
    homeSliderOptions = {
        autoplay: 5000,
        loop: true,
        pager: true
    };
    private ws = null;

    // constructor(private regService: RegistrationService, private wsService: WebSocketService, private sdService: ScheduleService) {
    //     super();
    //     this.wsService.subscribe(evt => {
    //         for (let mess of evt.mess) {
    //             this.imgList.push(mess.bufferUrl);
    //         }
    //     });
    // }

    ngOnInit() {
        //called after the constructor and called  after the first ngOnChanges() 
        // this.wsService.addListener(this);
        // this.sdService.addListener(this);
    }

    // onScheduleRecieved(schedule: any): void {
    //     if ((schedule.length && schedule[0].programs.length) != undefined) {
    //         this.program.name = schedule[0].programs[0].programName;
    //         this.program.hostedBy = schedule[0].programs[0].hostedBy;
    //         this.program.artistImgUrl = Config.WS_URL + Config.USER_TYPE_RJ + schedule[0].programs[0].artistImgUrl;

    //     }
    // }

    // // onEventRecieved(event: any): void {
    // //     for (let img of event[0].mess) {
    // //         this.imgList.push(img.bufferUrl)
    // //     }
    // // }


}
