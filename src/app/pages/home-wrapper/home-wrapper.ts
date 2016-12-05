import { Component } from '@angular/core';
import { Home } from '../home/home';
import { Schedules } from '../schedules/schedules';
import { Platform } from 'ionic-angular';
import { Injector } from '@angular/core';
import { AndroidPlayBackService } from '../../service/android-playback';
import { IOSPlayBackService } from '../../service/ios-playback';
import { AbstractBasePlayBack } from '../../utils/abstract-base-playback';

@Component({
    templateUrl: 'home-wrapper.html',
})
export class HomeWrapper {
    nowPlaying = Home;
    schedule = Schedules;

    private playBackService: AbstractBasePlayBack;
    public constructor(private injector: Injector, private platform: Platform) {
        if (this.platform.is('android')) {
            this.playBackService = this.injector.get(AndroidPlayBackService);
        }else if (this.platform.is('ios')) {
            this.playBackService = this.injector.get(IOSPlayBackService);
        }
    }
}
