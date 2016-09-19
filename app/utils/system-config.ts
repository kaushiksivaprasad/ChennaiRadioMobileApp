class Config {
    WS_URL: string = 'http://localhost:8080/';
    LOGIN_RESOURCE: string = 'login';
    USER_TYPE_RJ = 'RJ';
    USER_TYPE_ADMIN = 'Admin';
    USER_TYPE_CUSTOMER = 'User';
    PASSWORD_LEN = 6;
    SIGNUP_RESOURCE: string = 'signup';
}
let configObj = new Config();
export default configObj;