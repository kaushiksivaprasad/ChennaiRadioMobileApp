import {Component} from '@angular/core';
import {RegistrationService} from '../../service/registration';
import {WebSocketService} from '../../service/websocket';
import { AlertController, NavController, LoadingController} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import Utils from '../../utils/utils';
import {ScheduleService} from '../../service/schedule';
import {HomeWrapper} from '../home-wrapper/home-wrapper';
import {EventBus} from '../../service/eventbus';
import Config from '../../utils/system-config';

declare var cordova: any;
@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class Login {
  showLogin = false;
  emailId = '';
  password = '';
  loaderInstance = null;
  constructor(private alertCtrl: AlertController,
    private navCtrl: NavController,
    private regService: RegistrationService,
    private wsService: WebSocketService, private scheduleService: ScheduleService,
    private eventBus: EventBus,
    private loadingController: LoadingController
  ) {
    console.log('Login -> constructor');
    this.loaderInstance = null;
    if (cordova) {
      cordova.plugins.SecureLocalStorage.
        getItem(Config.LOGIN_INFO_STORAGE_KEY).then((loginInfo) => {
          if (loginInfo) {
            loginInfo = JSON.parse(loginInfo);
            console.log(loginInfo);
            this.emailId = loginInfo.email;
            this.password = loginInfo.password;
            this.loaderInstance = this.loadingController.create({
              content: 'Please wait...'
            });
            this.loaderInstance.present();
            this.onLogin(loginInfo.email, loginInfo.password);
          } else {
            this.showLogin = true;
            if (this.loaderInstance) {
              this.loaderInstance.dismissAll();
            }
          }
        });
    }
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
        this.setToLocalStorage(loginInfo);
        if (element) {
          element.disabled = false;
        }
        this.wsService.resourceUrl = json.url;
        this.scheduleService.resourceUrl = json.url;
        this.eventBus.resourceUrl = json.url;
        this.navCtrl.setRoot(HomeWrapper);
        if (this.loaderInstance) {
          this.loaderInstance.dismiss();
        }
      }).catch(err => {
        this.showAlert(err.message);
        if (element) {
          element.disabled = false;
        }
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
    this.navCtrl.push(SignupPage);
  }

  setToLocalStorage(info: { email: string, password: string }) {
    cordova.plugins.SecureLocalStorage.setItem(Config.LOGIN_INFO_STORAGE_KEY, JSON.stringify(info));
    // cordova.plugins.SecureLocalStorage.setItem(Config.RESOURCE_URL, info.resourceURL);
  }

}
