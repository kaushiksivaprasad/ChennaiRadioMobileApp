import { Component } from '@angular/core';
import { RegistrationService } from '../../service/registration';
import { WebSocketService } from '../../service/websocket';
import { AlertController, NavController, LoadingController } from 'ionic-angular';
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
    private wsService: WebSocketService,
    private scheduleService: ScheduleService,
    private eventBus: EventBus,
    private loadingController: LoadingController
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
    let loginInfo = {
      email: emailId.trim().toLowerCase(),
      password: password
    };
    this.regService.doLogin(loginInfo).then(json => {
      console.log('User successfully logged in and the json is ' + json);
      // initialize the urls of all the services
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

  private showAlert(subTitle) {
    let alert = this.alertCtrl.create({
      title: 'Login',
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
