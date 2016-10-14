import {Component, ViewChild} from '@angular/core';
import {RegistrationService} from '../../service/registration';
import { AlertController, NavController, ToastController, Toast, Content, Platform} from 'ionic-angular';
import Utils from '../../utils/utils';
import {User} from '../../models/user';
import Config from '../../utils/system-config';

declare var cordova: any;

@Component({
  templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage {
  @ViewChild(Content) content: Content;
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    public regService: RegistrationService,
    private platform: Platform) {
    // window.addEventListener('native.keyboardshow', (e: any) => {
    //   let deviceHeight = this.platform.height();
    //   let keyboardHeight = e.keyboardHeight;
    //   let deviceHeightAdjusted = deviceHeight - keyboardHeight;
    //   deviceHeightAdjusted = deviceHeightAdjusted < 0 ? (deviceHeightAdjusted * -1) : deviceHeightAdjusted;
    //   document.getElementById('contentDiv').style.height = deviceHeightAdjusted + 'px';
    // });

    // window.addEventListener('native.keyboardhide', (e) => {
    //   document.getElementById('contentDiv').style.height = '100%';
    // });
  }
  toast: Toast = null;
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
      this.showAlert('Please enter the phoneNo in the specified format');
    } else {
      let user = new User();
      user.emailId = Utils.preProcessString(emailId);
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
      title: 'Login',
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  // onFocus(event: any) {
  //   cordova.plugins.Keyboard.show();
  //   let top = event.target.getBoundingClientRect().top;
  //   let left = event.target.getBoundingClientRect().left;
  //   this.content.scrollTo(left, top);
  //   // console.log('Platform content height -> ' + this.platform.height);
  //   // console.log('scroll top -> ' + top);
  // }



  // ionViewWillLeave() {
  //   if (this.toast) {
  //     this.toast.onDidDismiss = null;
  //     this.toast.dismiss();
  //   }
  // }
}
