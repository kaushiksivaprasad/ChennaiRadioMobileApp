import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import Config from '../utils/system-config'
import {User} from '../models/user'

@Injectable()
export class RegistrationService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    constructor(private http: Http) {
    }

    doLogin(user: { email: String, password: String }): Promise<Response> {
        let url: string = Config.WS_URL + Config.LOGIN_RESOURCE + `?email=${user.email}&password=${user.password}`;
        return this.http.get(url)
            .toPromise()
            .then(response => {
                return response.json();
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
}
