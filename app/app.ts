import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Login} from './pages/login/login';
import {RegistrationService} from './service/registration'

@Component({
  templateUrl: 'build/app.html',
  providers: [RegistrationService]
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
