class Config {
    // WS_URL: string = 'http://ed0180c0.ngrok.io/rest/';
    WS_URL: string = 'http://52.87.160.13/rest/';
    
    LOGIN_RESOURCE: string = 'login';
    USER_TYPE_RJ = 'RJ';
    USER_TYPE_ADMIN = 'Admin';
    USER_TYPE_CUSTOMER = 'User';
    PASSWORD_LEN = 3;
    SIGNUP_RESOURCE: string = 'signup';
    WS_RESOURCE = 'ws';
    SCHEDULE_RESOURCE = 'schedule';
    STREM_RESOURCE = 'stream';
    LOGIN_INFO_STORAGE_KEY = 'loginInfo';
    RESOURCE_URL = 'resourceURL';
}
let configObj = new Config();
export default configObj;