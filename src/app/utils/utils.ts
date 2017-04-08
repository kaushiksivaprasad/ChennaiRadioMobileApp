import Config from './system-config';
import * as moment from 'moment';
class Utils {
    isValidString(x: string) {
        x = x.trim();
        if (x.length > 0) {
            return true;
        }
        return false;
    }

    preProcessString(x: string) {
        x = x.trim();
        return x;
    }

    isValidEmailId(x: string) {
        if (this.isValidString(x)) {
            x = x.trim();
            if (x.indexOf('@') !== -1) {
                return true;
            }
        }
        return false;
    }

    isValidPassword(x: string) {
        if (this.isValidString(x)) {
            x = x.trim();
            if (x.length >= Config.PASSWORD_LEN) {
                return true;
            }
        }
        return false;
    }

    isValidPhoneNo(x: string) {
        if (this.isValidString(x)) {
            x = x.trim();
            if (x.length === Config.PHONE_NO_LEN) {
                return !isNaN(parseInt(x, 10));
            }
        }
        return false;
    }

    extractFirstProgramFromSchedule(schedules): {
        name: string,
        hostedBy: string,
        artistImgUrl: any,
        duration: number,
        elapsed: number
    } {
        let program = {
            name: null,
            hostedBy: null,
            artistImgUrl: null,
            duration : null,
            elapsed: null
        };
        if (schedules[0].programs && schedules[0].programs.length > 0) {
            let dayToSet = schedules[0].dayPlayed;
            let endTimeInHour: number = + schedules[0].programs[0].endTimeInHour;
            let endTimeInMinues: number = + schedules[0].programs[0].endTimeInMinutes;
            let startTimeInHour: number = + schedules[0].programs[0].startTimeInHour;
            let startTimeInMinutes: number = + schedules[0].programs[0].startTimeInMinutes;
            let startTime = moment().utc().day(dayToSet).hours(startTimeInHour).
                minutes(startTimeInMinutes).valueOf();
            let endTime = moment().utc().day(dayToSet).hours(endTimeInHour).
                minutes(endTimeInMinues).valueOf();
            let currentTime = moment().utc().valueOf();

            if (startTime <= currentTime && endTime > currentTime) {
                program.name = schedules[0].programs[0].programName;
                program.hostedBy = schedules[0].programs[0].hostedBy;
                program.artistImgUrl = schedules[0].programs[0].artistImgUrl;
                program.duration = endTime - startTime;
                program.elapsed = currentTime - startTime;
                return program;
            }
        }
        return null;
    }

}
let utilsObj = new Utils();

export default utilsObj;
