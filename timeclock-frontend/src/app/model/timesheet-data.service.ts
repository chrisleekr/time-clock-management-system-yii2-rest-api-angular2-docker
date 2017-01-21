import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from '../global.service';
import {UserService} from './user.service';
import {Timesheet} from './timesheet';
import {StaffTimesheet} from "./staff-timesheet";

@Injectable()
export class TimesheetDataService {

    constructor(private _http:Http,
                private _globalService:GlobalService,
                private _userService:UserService){
    }

    // POST /v1/timesheet
    addTimesheet(timesheet:Timesheet):Observable<any>{
        let headers = this.getHeaders();

        return this._http.post(
            this._globalService.apiHost+'/timesheet',
            JSON.stringify(timesheet),
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

    // DELETE /v1/timesheet/1
    deleteTimesheetById(id:number):Observable<boolean>{
        let headers = this.getHeaders();

        return this._http.delete(
            this._globalService.apiHost+'/timesheet/'+id,
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

    // PUT /v1/timesheet/1
    updateTimesheetById(timesheet:Timesheet):Observable<any>{
        let headers = this.getHeaders();

        return this._http.put(
            this._globalService.apiHost+'/timesheet/'+timesheet.id,
            JSON.stringify(timesheet),
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

    // GET /v1/timesheet
    getAllTimesheets(): Observable<Timesheet[]> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/timesheet?sort=-update_time',
                {
                    headers: headers
                }
            )
            .map(response => response.json())
            .map((response) => {
                return <Timesheet[]>response.data;
            })
            .catch(this.handleError);
    }

    // GET /v1/timesheet/staff
    getStaffsForTimesheet():Observable<StaffTimesheet[]> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/timesheet/staff',
                {
                    headers: headers
                }
            )
            .map(response => response.json())
            .map((response) => {
                return <StaffTimesheet[]>response.data;
            })
            .catch(this.handleError);
    }

    // GET /v1/timesheet/1
    getTimesheetById(id:number):Observable<Timesheet> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/timesheet/'+id,
                {
                    headers: headers
                }
            )
            .map(response => response.json())
            .map((response) => {
                return <Timesheet>response.data;
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
