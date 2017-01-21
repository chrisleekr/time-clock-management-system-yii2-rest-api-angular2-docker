import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from '../global.service';
import {UserService} from './user.service';
import {Staff} from './staff';

@Injectable()
export class StaffDataService {

    constructor(private _http:Http,
                private _globalService:GlobalService,
                private _userService:UserService){
    }

    // POST /v1/staff
    addStaff(staff:Staff):Observable<any>{
        let headers = this.getHeaders();

        return this._http.post(
            this._globalService.apiHost+'/staff',
            JSON.stringify(staff),
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

    // DELETE /v1/staff/1
    deleteStaffById(id:number):Observable<boolean>{
        let headers = this.getHeaders();

        return this._http.delete(
            this._globalService.apiHost+'/staff/'+id,
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

    // PUT /v1/staff/1
    updateStaffById(staff:Staff):Observable<any>{
        let headers = this.getHeaders();

        return this._http.put(
            this._globalService.apiHost+'/staff/'+staff.id,
            JSON.stringify(staff),
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
    // GET /v1/staff
    getAllStaffs(): Observable<Staff[]> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/staff?sort=staff_name',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Staff[]>response.data;
            })
            .catch(this.handleError);
    }

    getStaffById(id:number):Observable<Staff> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/staff/'+id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Staff>response.data;
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
