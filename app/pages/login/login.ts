import {Component} from '@angular/core';
import {RegistrationService} from '../../service/registration';
import {WebSocketService} from '../../service/websocket';
import { AlertController, NavController} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import Utils from '../../utils/utils';
import {ScheduleService} from '../../service/schedule';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class Login {
  constructor(private alertCtrl: AlertController,
    private navCtrl: NavController,
    private regService: RegistrationService,
    private wsService: WebSocketService, private scheduleService: ScheduleService
  ) {
  }
  onLogin(emailId: string, password: string) {
    if (!Utils.isValidString(emailId) || !Utils.isValidString(password)) {
      this.showAlert('EmailId and Password is required.');
    } else if (!Utils.isValidEmailId(emailId)) {
      this.showAlert('Please enter a valid EmailId.');
    } else if (!Utils.isValidPassword(password)) {
      this.showAlert('Password length needs to be atleast 6');
    } else {
      this.regService.doLogin({
        email: emailId,
        password: password
      }).then(json => {
        console.log('User successfully logged in and the json is ' + json);
        this.wsService.resourceUrl = json.url;
        this.scheduleService.resourceUrl = json.url;

        this.wsService.initiateWebSocket();
        this.scheduleService.getSchedule();
      }).catch(err => {
        this.showAlert(err.message);
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
}
