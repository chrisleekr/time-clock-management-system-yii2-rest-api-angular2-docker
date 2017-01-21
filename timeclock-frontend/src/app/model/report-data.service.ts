import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from '../global.service';
import {UserService} from './user.service';
import {ReportTimesheet} from './report-timesheet';
import {StaffTimesheet} from "./staff-timesheet";

@Injectable()
export class ReportDataService {

    constructor(private _http:Http,
                private _globalService:GlobalService,
                private _userService:UserService){
    }

    private getHeaders():Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this._userService.getAccessToken(),
        });
    }

    // GET /v1/report/timesheet
    getReportTimesheet(startDate:string, finishDate:string): Observable<ReportTimesheet> {
        let headers = this.getHeaders();

        return this._http.get(
            this._globalService.apiHost+'/report/timesheet?start_date='+startDate+'&finish_date='+finishDate,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <ReportTimesheet>response.data;
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
