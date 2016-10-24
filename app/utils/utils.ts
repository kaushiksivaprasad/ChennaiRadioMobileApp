import Config from './system-config';
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
        artistImgUrl: any
    } {
        let program = {
            name: null,
            hostedBy: null,
            artistImgUrl: null
        };
        if (schedules[0].programs && schedules[0].programs.length > 0) {
            program.name = schedules[0].programs[0].programName;
            program.hostedBy = schedules[0].programs[0].hostedBy;
            program.artistImgUrl = schedules[0].programs[0].artistImgUrl;
            return program;
        }
        return null;
    }

}
let utilsObj = new Utils();

export default utilsObj;