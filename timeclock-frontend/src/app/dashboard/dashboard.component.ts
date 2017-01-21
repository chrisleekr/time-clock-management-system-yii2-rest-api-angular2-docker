import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GlobalService} from "../global.service";
import {ActivityDataService} from "../model/activity-data.service";
import {Activity} from "../model/activity";
import * as moment from "moment";
import {UserService} from "../model/user.service";

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    private _activities:Activity[];
    private _errorMessage:string;

    constructor(private _activityDataService:ActivityDataService,
                private _userService:UserService,
                private _globalService:GlobalService,
                private _router:Router) {
    }

    ngOnInit(): void {
        this.getLatestActivities();
    }

    public getLatestActivities() {
        this._activities = [];

        let tmpDates = this._globalService.getInitialStartFinishDate();
        let startDate = tmpDates.start_date.format('YYYY-MM-DD');
        let finishDate = tmpDates.finish_date.format('YYYY-MM-DD');

        this._activityDataService.getAllActivities(startDate, finishDate, 10)
            .subscribe(
                activities => {
                    this._activities = activities
                },
                error =>  {
                    // unauthorized access
                    if(error.status == 401) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        this._errorMessage = error.data.message;
                    }
                }
            );
    }
}
