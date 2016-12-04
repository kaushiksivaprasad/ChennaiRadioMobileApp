import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RegistrationService } from '../../service/registration';
import { WebSocketService } from '../../service/websocket';
import { AlertController, NavController, LoadingController, Platform } from 'ionic-angular';
import Utils from '../../utils/utils';
import { ScheduleService } from '../../service/schedule';
import { HomeWrapper } from '../home-wrapper/home-wrapper';
import { EventBus } from '../../service/eventbus';

declare var cordova: any;
@Component({
  templateUrl: 'login.html'
})
export class Login {
  loaderInstance = null;
  emailId = 'test@h.com';
  password = '123';

  constructor(private alertCtrl: AlertController,
    private navCtrl: NavController,
    private regService: RegistrationService,
    private wsService: WebSocketService, private scheduleService: ScheduleService,
    private eventBus: EventBus,
    private loadingController: LoadingController,
    private platform: Platform,
    private sanitizer: DomSanitizer
  ) {
    console.log('Login -> constructor');
    this.loaderInstance = null;
    this.loaderInstance = this.loadingController.create({
      content: 'Loading..'
    });
    this.loaderInstance.present();
    this.onLogin(this.emailId, this.password);
  }
  onLogin(emailId: string, password: string) {
    if (!Utils.isValidString(emailId) || !Utils.isValidString(password)) {
      this.showAlert('EmailId and Password is required.');
    } else if (!Utils.isValidEmailId(emailId)) {
      this.showAlert('Please enter a valid EmailId.');
    } else if (!Utils.isValidPassword(password)) {
      this.showAlert('Password length needs to be atleast 6');
    } else {
      let element = <HTMLInputElement>document.getElementById('login');
      if (element) {
        element.disabled = true;
      }
      let loginInfo = {
        email: emailId.trim().toLowerCase(),
        password: password
      };
      this.regService.doLogin(loginInfo).then(json => {
        console.log('User successfully logged in and the json is ' + json);
        if (element) {
          element.disabled = false;
        }
        //initialize the urls of all the services
        this.wsService.resourceUrl = json.url;
        this.scheduleService.resourceUrl = json.url;
        this.eventBus.resourceUrl = json.url;
        this.navCtrl.setRoot(HomeWrapper);
        if (this.loaderInstance) {
          this.loaderInstance.dismiss();
        }
      }).catch(err => {
        this.showAlert('Some error occured.');
        if (this.loaderInstance) {
          this.loaderInstance.dismiss();
        }
      });
    }
  }

  private showAlert(subTitle) {
    let alert = this.alertCtrl.create({
      title: 'Login',
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  onSignUp() {
  }

  getBGImgStyle() {
    let imgUrl = cordova.file.applicationDirectory + 'www/assets/img/bg_min.jpg'
    let bgSize = this.platform.width() + "px " + this.platform.height() + "px";
    let retJson = {
      "background-image": 'url(' + imgUrl + ')',
      "background-size": bgSize
    };
    return retJson;
  }
}
