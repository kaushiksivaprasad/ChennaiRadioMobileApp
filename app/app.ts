import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Login} from './pages/login/login';
import {HomeWrapper} from './pages/home-wrapper/home-wrapper';
import {RegistrationService} from './service/registration';
import {WebSocketService} from './service/websocket';
import {ScheduleService} from './service/schedule';
// import WebSocketService from './service/websocket';

@Component({
  templateUrl: 'build/app.html',
  providers: [RegistrationService, WebSocketService, ScheduleService]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make Login the root (or first) page
  rootPage: any = Login;

  constructor(
    public platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
