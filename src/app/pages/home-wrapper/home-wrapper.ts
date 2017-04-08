import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Home } from '../home/home';
import { Schedules } from '../schedules/schedules';
import { Platform, Tabs, NavController} from 'ionic-angular';
import { Injector } from '@angular/core';
import * as Viewer from 'viewerjs';
import { AndroidPlayBackService } from '../../service/android-playback';
import { IOSPlayBackService } from '../../service/ios-playback';
import { EventBus } from '../../service/eventbus';
import { RatingService } from '../../service/RatingService';
import { AbstractBasePlayBack } from '../../utils/abstract-base-playback';
import Config from '../../utils/system-config';
import { ScreenOrientation } from 'ionic-native';

@Component({
    templateUrl: 'home-wrapper.html',
})
export class HomeWrapper implements AfterViewInit {
    nowPlaying = Home;
    schedule = Schedules;
    @ViewChild('imageWrapper') imageWrapper: ElementRef;
    @ViewChild('tabs') tabs: Tabs;
    fullScreenImgViewer = null;
    imgUrls: Array<any> = null;
    fullScreenImgViewerShown = false;
    addDblClickHandler = false;

    private playBackService: AbstractBasePlayBack;
    public constructor(private injector: Injector, private platform: Platform,
        private eventBus: EventBus, private nav: NavController, private ratingService: RatingService) {
        if (this.platform.is('android')) {
            this.playBackService = this.injector.get(AndroidPlayBackService);
        } else if (this.platform.is('ios')) {
            this.playBackService = this.injector.get(IOSPlayBackService);
        }
        this.eventBus.fullScreenImgViewerEvent.subscribe(event => {
            if (event.eventType === Config.FULL_SCREEN_VIEWER_OPEN) {
                console.log('HomeWrapper -> recieved fullScreen viewer open event');
                this.openImgInFullScreen(event.data);
            } else if (event.eventType === Config.FULL_SCREEN_VIEWER_UPDATE_DATA) {
                this.imgUrls = event.data;
                if (this.fullScreenImgViewer) {
                    this.fullScreenImgViewer.update();
                }
            }
        });
        this.platform.registerBackButtonAction(() => {
            if (this.fullScreenImgViewerShown) {
                this.fullScreenImgViewer.hide();
            } else {
                if (this.tabs._selectHistory && this.tabs._selectHistory.length > 1) {
                    let removedTab = this.tabs._selectHistory.splice(this.tabs._selectHistory.length - 2, 2);
                    let tabs = this.tabs._tabs;
                    for (let i = 0; i < tabs.length; i++) {
                        if (tabs[i].id === removedTab[0]) {
                            this.tabs.select(tabs[i]);
                        }
                    }
                }
            }
        });
        console.log('HomeWrapper -> loaded');
    }

    createFullScreenImgViewer() {
        if (this.imageWrapper) {
            console.log('HomeWrapper -> createFullScreenImgViewer');
            let fullScreenViewerConfig: any = Config.FULL_SCREEN_VIEWR_OPTIONS;
            fullScreenViewerConfig.ready = () => {
                console.log('HomeWrapper -> fullScreenViewer -> ready');
            };
            fullScreenViewerConfig.shown = () => {
                console.log('HomeWrapper-> fullScreenViewer -> shown');
                if (typeof cordova !== 'undefined')
                    ScreenOrientation.unlockOrientation();
                this.fullScreenImgViewerShown = true;
            };
            fullScreenViewerConfig.hide = () => {
                console.log('HomeWrapper -> fullScreenViewer -> hide');
                this.fullScreenImgViewerShown = false;
                return setTimeout(() => {
                    if (typeof cordova !== 'undefined')
                        ScreenOrientation.lockOrientation('portrait');
                }, 10);
            };
            //  https://fengyuanchen.github.io/viewerjs/
                this.fullScreenImgViewer = new Viewer(this.imageWrapper.nativeElement, fullScreenViewerConfig);
                console.log(this.fullScreenImgViewer);
        }
    }

    openImgInFullScreen(index) {
        if (this.imageWrapper) {
            console.log('HomeWrapper -> openImgInFullScreen');
            if (!this.fullScreenImgViewer) {
                this.createFullScreenImgViewer();
            }
            if (index >= 0) {
                let children = this.imageWrapper.nativeElement.querySelectorAll('img');
                if (index <= children.length) {
                    children[index].click();
                }
            }
        }
    }

    ngAfterViewInit() {
        this.ratingService.showPrompt();
    }
}
