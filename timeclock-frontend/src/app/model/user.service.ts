import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { GlobalService } from '../global.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';
import {Router} from "@angular/router";

@Injectable()
export class UserService {
    private loggedIn = false;
    public redirectURL = '';

    constructor(private _http:Http,
                private _globalService:GlobalService,
                private _router:Router){
        this.loggedIn = this.checkAccessToken();
    }

    public login(username, password) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        return this._http
            .post(
                this._globalService.apiHost+'/user/login',
                JSON.stringify({
                    "LoginForm": {
                        "username":username,
                        "password":password
                    }
                }),
                {headers}
            )
            .map(response => response.json())
            .map((response) => {
                if(response.success) {
                    localStorage.setItem('access_token', response.data.access_token);
                    this.loggedIn = true;
                } else {
                    localStorage.removeItem('access_token');
                    this.loggedIn = false;
                }
                return response;
            })
            .catch(this.handleError);
    }

    public logout():void {
        localStorage.removeItem('access_token');
        this.loggedIn = false;
    }

    public getAccessToken():any{
        return localStorage.getItem('access_token');
    }

    private checkAccessToken():any{
        return !!localStorage.getItem('access_token');
    }

    public unauthorizedAccess(error:any):void {
        this.logout();
        this._router.navigate(['/login']);
    }

    public isLoggedIn():boolean {
        this.loggedIn = this.checkAccessToken();
        return this.loggedIn;
    }
    private handleError (error: Response | any) {

        let errorMessage:any = {};
        // Connection error
        if(error.status == 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: "Sorry, there was a connection error occurred. Please try again.",
            };
        }
        else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }
}