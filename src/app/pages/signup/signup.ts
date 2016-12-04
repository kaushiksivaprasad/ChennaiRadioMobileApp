import { Component, ViewChild } from '@angular/core';
import { RegistrationService } from '../../service/registration';
import { EventBus } from '../../service/eventbus';
import { AlertController, NavController, ToastController, Toast, Content, Platform } from 'ionic-angular';
import Utils from '../../utils/utils';
import { User } from '../../models/user';
import Config from '../../utils/system-config';
import { DomSanitizer } from '@angular/platform-browser';

declare var cordova: any;

@Component({
  templateUrl: 'signup.html'
})
export class SignupPage {
  @ViewChild(Content) content: Content;
  bgImgStyle = null;
  toast: Toast = null;
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    public regService: RegistrationService,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private eventBus: EventBus
  ) {
  }

  register(emailId, password, firstName, lastName, phoneNo) {
    if (!Utils.isValidString(emailId) ||
      !Utils.isValidString(password) ||
      !Utils.isValidString(firstName) ||
      !Utils.isValidString(lastName) ||
      !Utils.isValidString(phoneNo)) {
      this.showAlert('All the fields are mandatory');
    } else if (!Utils.isValidEmailId(emailId)) {
      this.showAlert('Please enter a valid EmailId.');
    } else if (!Utils.isValidPassword(password)) {
      this.showAlert('Password length needs to be atleast 6');
    } else if (!Utils.isValidPhoneNo(phoneNo)) {
      this.showAlert('Please enter a valid phoneNo in the specified format');
    } else {
      let user = new User();
      user.emailId = Utils.preProcessString(emailId).toLowerCase();
      user.password = Utils.preProcessString(password);
      user.firstName = Utils.preProcessString(firstName);
      user.lastName = Utils.preProcessString(lastName);
      user.phoneNo = Utils.preProcessString(phoneNo);
      user.userType = Config.USER_TYPE_CUSTOMER;
      let element = <HTMLInputElement>document.getElementById('register');
      element.disabled = true;
      this.regService.signup(user).then(data => {
        this.toast = this.toastCtrl.create({
          message: 'Signup successful',
          duration: 700,
          position: 'bottom'
        });
        this.toast.onDidDismiss(() => {
          console.log('toast on dismiss');
          this.navCtrl.remove(this.navCtrl.length() - 1).then(() => {
            this.navCtrl.pop();
            let userEvent = {
              emailId: user.emailId,
              password: user.password
            }
            this.eventBus.triggerSignupSuccessfulEvent(userEvent);
          });
        });
        this.toast.present();
        element.disabled = false;
      }).catch(err => {
        this.showAlert('Some error occured. Please try again later');
        element.disabled = false;
      });
    }
  }
  private showAlert(subTitle) {
    let alert = this.alertCtrl.create({
      title: 'Signup',
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
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
