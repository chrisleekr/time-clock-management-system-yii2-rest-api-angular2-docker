import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from '../global.service';
import {UserService} from './user.service';
import {Setting} from './setting';

@Injectable()
export class SettingDataService {

    constructor(private _http:Http,
                private _globalService:GlobalService,
                private _userService:UserService){
    }

    // POST /v1/setting
    // addSetting(setting:Setting):Observable<any>{
    //     let headers = this.getHeaders();
    //
    //     return this._http.post(
    //         this._globalService.apiHost+'/setting',
    //         JSON.stringify(setting),
    //         {
    //             headers: headers
    //         }
    //     )
    //         .map(response => response.json())
    //         .map((response) => {
    //             return response;
    //         })
    //         .catch(this.handleError);
    // }

    // DELETE /v1/setting/1
    // deleteSettingById(id:number):Observable<boolean>{
    //     let headers = this.getHeaders();
    //
    //     return this._http.delete(
    //         this._globalService.apiHost+'/setting/'+id,
    //         {
    //             headers: headers
    //         }
    //     )
    //         .map(response => response.json())
    //         .map((response) => {
    //             return response;
    //         })
    //         .catch(this.handleError);
    // }

    // PUT /v1/setting/1
    updateSettingById(setting:Setting):Observable<any>{
        let headers = this.getHeaders();

        return this._http.put(
            this._globalService.apiHost+'/setting/'+setting.id,
            JSON.stringify(setting),
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    private getHeaders():Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this._userService.getAccessToken(),
        });
    }
    // GET /v1/setting
    getAllSettings(): Observable<Setting[]> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/setting?sort=meta_key',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Setting[]>response.data;
            })
            .catch(this.handleError);
    }

    refreshGlobalSettings():void{
        // get settings
        this._globalService.loadGlobalSettingsFromLocalStorage();

        this.getAllSettingsPublic()
            .subscribe(
                settings => {
                    settings.forEach(setting => {
                        if(this._globalService.hasOwnProperty(setting.meta_key)){
                            localStorage.setItem(setting.meta_key, setting.meta_value);
                            switch(setting.meta_type) {
                                case 'select':
                                case 'text':
                                    this._globalService[setting.meta_key] = setting.meta_value;
                                    break;
                                case 'number':
                                    this._globalService[setting.meta_key] = +setting.meta_value;
                                    break;
                            }
                        }
                    });


                }
            );
    }

    // GET /v1/setting/public
    getAllSettingsPublic(): Observable<Array<any>> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/setting/public',
            {
                // headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Array<any>>response.data;
            })
            .catch(this.handleError);
    }

    getSettingById(id:number):Observable<Setting> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/setting/'+id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Setting>response.data;
            })
            .catch(this.handleError);
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
