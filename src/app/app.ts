import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Login } from './pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  deviceReady: boolean = false;

  constructor(
    public platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('ios')) {
        console.log('ios');
        StatusBar.overlaysWebView(false);
        StatusBar.styleBlackOpaque();
      } else {
        console.log('android');
      }
      Splashscreen.hide();
      this.rootPage = Login;
      this.deviceReady = true;
      console.log('app loaded..');
    });
  }
}