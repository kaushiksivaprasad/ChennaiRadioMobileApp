import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app';
import { RegistrationService } from './service/registration';
import { WebSocketService } from './service/websocket';
import { ScheduleService } from './service/schedule';
import { EventBus } from './service/eventbus';
import { AndroidPlayBackService } from './service/android-playback';
import { IOSPlayBackService } from './service/ios-playback';
import { Login } from './pages/login/login';
import { HomeWrapper } from './pages/home-wrapper/home-wrapper';
import { Schedules } from './pages/schedules/schedules';
// import { SignupPage } from './pages/signup/signup';
import { Home } from './pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    Login,
    HomeWrapper,
    Schedules,
    // SignupPage,
    Home
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    HomeWrapper,
    Schedules,
    // SignupPage,
    Home
  ],
  providers: [RegistrationService, WebSocketService, ScheduleService, EventBus,AndroidPlayBackService, IOSPlayBackService]
})
export class AppModule { }
