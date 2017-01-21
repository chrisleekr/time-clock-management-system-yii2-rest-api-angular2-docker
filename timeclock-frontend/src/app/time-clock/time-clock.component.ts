import {
    Component, OnInit, AfterViewChecked, AfterViewInit, ViewChildren, QueryList,
    AfterContentChecked, AfterContentInit, ContentChildren, ViewChild
} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ModalDirective} from "ng2-bootstrap";
import * as moment from "moment";

import {TimesheetDataService} from '../model/timesheet-data.service';
import {Timesheet} from '../model/timesheet';
import {UserService} from '../model/user.service';
import {Staff} from "../model/staff";
import {StaffDataService} from "../model/staff-data.service";
import {StaffTimesheet} from "../model/staff-timesheet";
import {StopwatchComponent} from "../shared/stopwatch/stopwatch.component";
import {GlobalService} from "../global.service";

@Component({
    selector: 'app-timeclock',
    templateUrl: './time-clock.component.html',
})
export class TimeClockComponent implements OnInit, AfterViewChecked, AfterViewInit, AfterContentChecked, AfterContentInit {

    @ViewChildren(StopwatchComponent) stopwatchComponents: QueryList<StopwatchComponent>;
    @ViewChild('updateModal') public updateModal:ModalDirective;


    private _stopwatchInitialized:boolean = false;
    private _staffTimesheets:StaffTimesheet[];
    private _errorMessage:string;

    constructor(private _timesheetDataService:TimesheetDataService,
                private _staffDataService:StaffDataService,
                private _globalService:GlobalService,
                private _userService:UserService,
                private _router:Router) {
    }

    ngOnInit() {
        this.getStaffsForTimesheet();
    }


    ngAfterContentInit() {
        // contentChild is set after the content has been initialized
    }

    ngAfterContentChecked() {
        // contentChild is updated after the content has been checked
    }

    ngAfterViewInit() {
        // viewChild is set after the view has been initialized
        this.stopwatchComponents.changes.subscribe(() => {
            this.stopwatchComponents.forEach(stopwatchComponent => {
                if(stopwatchComponent.started == false) {
                    stopwatchComponent.start();
                }
            });
        });

    }

    ngAfterViewChecked() {
        // viewChild is updated after the view has been checked
    }

    public getStaffsForTimesheet() {
        this._staffTimesheets = null;
        this._timesheetDataService.getStaffsForTimesheet()
            .subscribe(
                staffTimesheets => {
                    this._staffTimesheets = staffTimesheets;
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


    public onClockToggle(mode:string, i:number, staffTimesheet:StaffTimesheet){


        if(mode == 'in') {
            this._clockIn(staffTimesheet);

        } else if(mode == 'out') {
            let now = moment();

            // compare current timesheet start time and now time
            // if current timesheet start time is less than 30 mins, then confirm time is correct or not
            let startTime = moment(staffTimesheet.current_timesheet.start_time);
            let diffMinutes = now.diff(startTime, 'minutes');

            if(diffMinutes <= 30) {
                let self = this;
                swal({
                    title: 'Are you sure?',
                    text: "Looks like you clocked in less than 30 minutes!",
                    type: 'question',
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, clock out!',
                    preConfirm: function () {
                        return new Promise(function (resolve, reject) {
                            self._clockOut(staffTimesheet);
                            resolve();
                        })
                    }
                }).then(function(result) {
                    // handle confirm, result is needed for modals with input

                }, function(dismiss) {
                    // dismiss can be "cancel" | "close" | "outside"
                });
            } else {
                this._clockOut(staffTimesheet);
            }


        }

    }

    private _clockIn(staffTimesheet:StaffTimesheet) {

        let now, remainder;

        now = moment();
        remainder = now.minute() % this._globalService.rounding_times;
        now = moment(now).subtract(remainder, "minutes");
        now = moment(now).second(0);

        staffTimesheet.is_clocked_in = 1;
        staffTimesheet.current_timesheet = new Timesheet();
        staffTimesheet.current_timesheet.staff_id = staffTimesheet.id;
        staffTimesheet.current_timesheet.start_time = moment(now).format("YYYY-MM-DD HH:mm:ss");
        staffTimesheet.current_timesheet.finish_time = null;

        // add new current time sheet
        // update timesheet with last timesheet
        this._timesheetDataService.addTimesheet(staffTimesheet.current_timesheet).
        subscribe(
            result => {
                if(result.success) {
                    // success
                    staffTimesheet.current_timesheet = <Timesheet>result.data;
                } else {

                }
            },
            error => {
                // Validation errors
                if(error.status == 422) {
                    // this._setFormErrors(error.data);
                }
                // Unauthorized Access
                else if(error.status == 401) {
                    this._userService.unauthorizedAccess(error);
                }
                // All other errors
                else {
                    this._errorMessage = error.data.message;
                }
            }
        );

    }

    private _clockOut(staffTimesheet:StaffTimesheet){
        let now, remainder;
        now = moment();
        remainder = this._globalService.rounding_times - now.minute() % this._globalService.rounding_times;
        now = moment(now).add(remainder, "minutes");
        now = moment(now).second(0);

        staffTimesheet.is_clocked_in = 0;
        staffTimesheet.current_timesheet.finish_time = moment(now).format("YYYY-MM-DD HH:mm:ss");

        staffTimesheet.last_timesheet = staffTimesheet.current_timesheet;
        staffTimesheet.last_timesheet.finish_time = staffTimesheet.current_timesheet.finish_time;

        staffTimesheet.current_timesheet = new Timesheet();

        // update timesheet with last timesheet
        this._timesheetDataService.updateTimesheetById(staffTimesheet.last_timesheet).
        subscribe(
            result => {
                if(result.success) {
                    // success
                    staffTimesheet.last_timesheet = <Timesheet>result.data;
                } else {

                }
            },
            error => {
                // Validation errors
                if(error.status == 422) {
                    // this._setFormErrors(error.data);
                }
                // Unauthorized Access
                else if(error.status == 401) {
                    this._userService.unauthorizedAccess(error);
                }
                // All other errors
                else {
                    this._errorMessage = error.data.message;
                }
            }
        );
    }

    private _updateStaffTimesheet:StaffTimesheet;
    private _updateTimesheet:Timesheet;
    private _updateTimesheetStartTime:string;
    private _updateTimesheetFinishTime:string;

    public onClickManualClockIn(staffTimesheet:StaffTimesheet){
        if(staffTimesheet.is_clocked_in == 1) {
            swal({
                title: 'Cannot add new time sheet',
                text: "You are currently clocked in. Please clock out prior to add new timesheet.",
                type: 'error',
            });
        } else {
            this._updateStaffTimesheet = staffTimesheet;
            this._updateTimesheet = new Timesheet();
            this._updateTimesheet.staff_id = staffTimesheet.id;
            this._updateTimesheet.start_time = moment().format("YYYY-MM-DD 00:00:00");
            this._updateTimesheet.finish_time = moment().format("YYYY-MM-DD 01:00:00");

            this._updateTimesheetStartTime = this._updateTimesheet.start_time;
            this._updateTimesheetFinishTime = this._updateTimesheet.finish_time;

            this.updateModal.show();
        }
    }

    public onClickAddTimesheet(){
        let startMoment = moment(this._updateTimesheetStartTime);
        let finishMoment = moment(this._updateTimesheetFinishTime);

        // Validate start/finish datetime
        if(startMoment >= finishMoment) {
            swal({
                title: 'Wrong time',
                text: "You cannot set finish time ealier than start time. Please set again.",
                type: 'error',
            });

        }
        // If valid, update timesheet
        else {
            let durationsDiff:any = moment(this._updateTimesheetFinishTime).diff(moment(this._updateTimesheetStartTime));
            let durations:number = moment.duration(durationsDiff).asSeconds();

            let durationsLabel:string = '';
            let durationsHour:number = Math.floor(durations / (60 * 60));
            durations -= durationsHour * (60 * 60);
            let durationsMinutes:number = Math.floor((durations / 60) % 60);
            durations -= durationsMinutes * 60;
            if(durationsHour == 1) {
                durationsLabel += durationsHour + ' Hour ';
            } else if(durationsHour >= 2) {
                durationsLabel += durationsHour + ' Hours ';
            }

            if(durationsMinutes == 1) {
                durationsLabel += durationsMinutes + ' Minute ';
            } else if(durationsMinutes >= 2) {
                durationsLabel += durationsMinutes + ' Minutes ';
            }

            let self = this;
            // Validate start/finish datetime
            swal({
                title: 'Please confirm new duration',
                html: 'Duration: '+durationsLabel+'<br />Start Time: '+moment(this._updateTimesheetStartTime).format('YYYY-MM-DD HH:mm')+'<br />Finish Time: '+moment(this._updateTimesheetFinishTime).format('YYYY-MM-DD HH:mm'),
                type: 'question',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, add it!',
                preConfirm: function () {
                    return new Promise(function (resolve, reject) {
                        let newTimesheet = new Timesheet();
                        // newTimesheet.id = self._updateTimesheet.id;
                        newTimesheet.staff_id = self._updateTimesheet.staff_id;
                        newTimesheet.start_time = moment(self._updateTimesheetStartTime).format('YYYY-MM-DD HH:mm:ss');
                        newTimesheet.finish_time = moment(self._updateTimesheetFinishTime).format('YYYY-MM-DD HH:mm:ss');

                        self._timesheetDataService.addTimesheet(newTimesheet).
                        subscribe(
                            result => {
                                self.getStaffsForTimesheet();
                                resolve();
                            },
                            error => {
                                // unauthorized access
                                if(error.status == 401) {
                                    self._userService.unauthorizedAccess(error);
                                } else {
                                    self._errorMessage = error.data.message;
                                }
                                resolve();
                            }
                        );

                        self.updateModal.hide();
                    })
                }
            }).then(function(result) {
                // handle confirm, result is needed for modals with input

            }, function(dismiss) {
                // dismiss can be "cancel" | "close" | "outside"
            });
        }

    }


    public onChangeDateTime(type:string, dateTime:string) {
        if(type == 'start_time') {
            this._updateTimesheetStartTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        } else if(type == 'finish_time') {
            this._updateTimesheetFinishTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        }
    }
}
