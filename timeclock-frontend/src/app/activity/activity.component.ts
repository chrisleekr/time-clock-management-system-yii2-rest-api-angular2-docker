import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../global.service";
import {UserService} from "../model/user.service";
import {Router} from "@angular/router";
import {ActivityDataService} from "../model/activity-data.service";
import {Activity} from "../model/activity";
import {ModalDirective} from "ng2-bootstrap";
import * as moment from "moment";
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
})
export class ActivityComponent implements OnInit {
    private _errorMessage:string;
    private myDateRangePickerOptions = {
        clearBtnTxt: 'Clear',
        beginDateBtnTxt: 'From Date',
        endDateBtnTxt: 'To Date',
        selectBeginDateTxt: 'Select From Date',
        selectEndDateTxt: 'Select To Date',
        acceptBtnTxt: 'OK',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '34px',
        width: '260px',
        inline: false,
        selectionTxtFontSize: '15px',
        alignSelectorRight: false,
        indicateInvalidDateRange: true,
        showDateRangeFormatPlaceholder: false,
        editableDateRangeField: false,
        inputValueRequired: true,
        showClearDateRangeBtn: false,
        showClearBtn: false,
    };

    private _startDate:string;
    private _finishDate:string;
    private _periodRangeValue:string;
    private _activities:Activity[];

    constructor(private _activityDataService:ActivityDataService,
                private _globalService:GlobalService,
                private _userService:UserService,
                private _router:Router) {

    }

    ngOnInit() {

        let tmpWeek = this._globalService.getWeekStartOn();
        let tmpDates = this._globalService.getInitialStartFinishDate();
        // set myRangeDatePicker
        this.myDateRangePickerOptions.firstDayOfWeek = tmpWeek.week_start_on_short;

        let startDate = tmpDates.start_date;
        let finishDate = tmpDates.finish_date;
        this._startDate = startDate.format('YYYY-MM-DD');
        this._finishDate = finishDate.format('YYYY-MM-DD');
        this._periodRangeValue = this._startDate + ' - ' + this._finishDate;
        // get start date of the week
        this.getAcitivities();
    }

    onDateRangeChanged(event:any) {
        this._startDate = event.beginDate.year+'-'+(event.beginDate.month < 10 ? '0' : '')+event.beginDate.month+'-'+(event.beginDate.day < 10 ? '0' : '')+event.beginDate.day;
        this._finishDate = event.endDate.year+'-'+(event.endDate.month < 10 ? '0' : '')+event.endDate.month+'-'+(event.endDate.day < 10 ? '0' : '')+event.endDate.day;

        this._periodRangeValue = this._startDate + ' - ' + this._finishDate;

        this.getAcitivities();
    }

    public getAcitivities() {
        this._activityDataService.getAllActivities(this._startDate, this._finishDate, 0)
            .subscribe(
                activities => {
                    this._activities = activities;
                },
                error => {
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
