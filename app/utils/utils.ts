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
            if (x.length >= Config.PASSWORD_LEN) {
                let indx = x.indexOf('-');
                if (indx !== -1) {
                    let result = x.length - (indx + 1);
                    if (result === 10) {
                        return true;
                    }
                }
            }
        }
        return false;
    }


}
let utilsObj = new Utils();

export default utilsObj;