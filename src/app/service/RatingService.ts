import { Injectable } from '@angular/core';
import { AppRate } from 'ionic-native';

@Injectable()
export class RatingService {
    prefsSet = false;
    constructor() {
    }

    setPreferences() {
        AppRate.preferences.storeAppURL = {
            ios: '1179949142',
            android: 'market://details?id=com.chennairadio.mobapp',
        };
        AppRate.preferences.promptAgainForEachNewVersion = true;
        AppRate.preferences.usesUntilPrompt = 5;
        AppRate.preferences.customLocale = {
            title: 'Rate Chennai Radio',
            message: 'If you enjoy using Chennai Radio, please leave us a 5 star rating.',
            cancelButtonLabel: 'No, Thanks',
            laterButtonLabel: 'Remind Me Later',
            rateButtonLabel: 'Rate It Now'
        };
    }
    showPrompt() {
        if (!this.prefsSet) {
            this.setPreferences();
            this.prefsSet = true;
            AppRate.promptForRating(false);
        }
    }
}
