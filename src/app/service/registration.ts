import { Injectable, EventEmitter, Inject} from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import Config from '../utils/system-config';
import {User} from '../models/user';

@Injectable()
export class RegistrationService {
    private resourceUrl: String;
    private signedInUser: { email: String, password: String };
    private headers = new Headers({ 'Content-Type': 'application/json' });
    public loginSuccesful = new EventEmitter<any>();
    constructor( @Inject(Http) public http: Http) {
    }

    doLogin(user: { email: String, password: String }): Promise<Response> {
        const url = Config.WS_URL + Config.LOGIN_RESOURCE;
        return this.http.post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(response => {
                let responseJson = response.json();
                if (responseJson.url) {
                    this.resourceUrl = responseJson.url;
                    this.signedInUser = user;
                    this.loginSuccesful.emit(this.resourceUrl);
                }
                // this.wsService.initiateWebSocket();
                return responseJson;
            })
            .catch(this.handleError);
    }

    signup(user: User): Promise<{
        message: string
    }> {
        const url = Config.WS_URL + Config.SIGNUP_RESOURCE;
        return this.http
            .post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.json());
        // return new 
        // Promise.reject(error.message || error);
    }

    getResourceUrl(): String {
        if (this.resourceUrl) {
            return this.resourceUrl;
        }
        throw new Error('User not logged in');
    }

    getSignedInUserInfo(): { email: String, password: String } {
        if (this.signedInUser) {
            return this.signedInUser;
        }
        throw new Error('User not logged in');
    }
}
