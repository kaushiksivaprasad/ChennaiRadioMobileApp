class Config {
    // WS_URL: string = 'http://347c2c7c.ngrok.io/rest/';
    WS_URL: string = 'http://api.chennairadio.ca/rest/';
    LOGIN_RESOURCE: string = 'login';
    USER_TYPE_RJ = 'RJ';
    USER_TYPE_ADMIN = 'Admin';
    USER_TYPE_CUSTOMER = 'User';
    PASSWORD_LEN = 3;
    PHONE_NO_LEN = 10;
    SIGNUP_RESOURCE: string = 'signup';
    WS_RESOURCE = 'ws';
    SCHEDULE_RESOURCE = 'schedule';
    STREM_RESOURCE = 'stream';
    LOGIN_INFO_STORAGE_KEY = 'loginInfo';
    RESOURCE_URL = 'resourceURL';
    STREAM_URL = 'http://api.chennairadio.ca:8000/stream?date=';
    FULL_SCREEN_VIEWR_OPTIONS = {
        navbar : 3,
        title : false,
        toolbar : false,
        rotatable : false,
        fullscreen : true,
        keyboard : false,
        transition : false,
        zoomable : true,
        movable : true
    };
    FULL_SCREEN_VIEWER_OPEN = 'fullScreenViewerOpen';
    FULL_SCREEN_VIEWER_UPDATE_DATA= 'fullScreenViewerUpdateData';
}
let configObj = new Config();
export default configObj;
