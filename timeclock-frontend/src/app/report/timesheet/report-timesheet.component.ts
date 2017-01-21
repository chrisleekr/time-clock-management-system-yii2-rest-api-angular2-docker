import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from "moment";
import {GlobalService} from "../../global.service";
import {UserService} from "../../model/user.service";
import {Router} from "@angular/router";
import {ReportDataService} from "../../model/report-data.service";
import {ReportTimesheet, ReportTimesheetTimesheet, ReportTimesheetStaff} from "../../model/report-timesheet";
import {ModalDirective} from "ng2-bootstrap";
import swal, {SweetAlertOptions} from 'sweetalert2';
import {TimesheetDataService} from "../../model/timesheet-data.service";
import {Timesheet} from "../../model/timesheet";

@Component({
    selector: 'app-report-timesheet',
    templateUrl: './report-timesheet.component.html',
})
export class ReportTimesheetComponent implements OnInit {
    @ViewChild('updateModal') public updateModal:ModalDirective;

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
    private _reportTimesheet:ReportTimesheet;

    constructor(private _reportDataService:ReportDataService,
                private _timesheetDataService:TimesheetDataService,
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
        this.getReportTimesheet();
    }

    onDateRangeChanged(event:any) {
        this._startDate = event.beginDate.year+'-'+(event.beginDate.month < 10 ? '0' : '')+event.beginDate.month+'-'+(event.beginDate.day < 10 ? '0' : '')+event.beginDate.day;
        this._finishDate = event.endDate.year+'-'+(event.endDate.month < 10 ? '0' : '')+event.endDate.month+'-'+(event.endDate.day < 10 ? '0' : '')+event.endDate.day;

        this._periodRangeValue = this._startDate + ' - ' + this._finishDate;

        this.getReportTimesheet();
    }

    public getReportTimesheet() {
        this._reportDataService.getReportTimesheet(this._startDate, this._finishDate)
            .subscribe(
                reportTimesheet => {
                    this._reportTimesheet = reportTimesheet;
                    this._startDate = this._reportTimesheet.start_date;
                    this._finishDate = this._reportTimesheet.finish_date;
                    this._periodRangeValue = this._startDate + ' - ' + this._finishDate;
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


    generateArray(obj){
        return Object.keys(obj).map((key)=>{ return obj[key]});
    }

    private _updateStaff:ReportTimesheetStaff;
    private _updateTimesheet:ReportTimesheetTimesheet;
    private _updateTimesheetStartTime:string;
    private _updateTimesheetFinishTime:string;

    public onClickEdit(timesheet:ReportTimesheetTimesheet, staff:ReportTimesheetStaff) {
        this._updateTimesheet = timesheet;
        this._updateTimesheetStartTime = timesheet.start_time_raw;
        this._updateTimesheetFinishTime = timesheet.finish_time_raw;
        this._updateStaff = staff;
        this.updateModal.show();

    }

    public onClickUpdateTimesheet(){
        let originalStartMoment = moment(this._updateTimesheet.start_time_raw);
            originalStartMoment.second(0);
        let originalFinishMoment = moment(this._updateTimesheet.finish_time_raw);
            originalFinishMoment.second(0);
        let startMoment = moment(this._updateTimesheetStartTime);
        let finishMoment = moment(this._updateTimesheetFinishTime);

        // Validate start/finish datetime
        if(startMoment >= finishMoment) {
            swal({
                title: 'Wrong time',
                text: "You cannot set finish time ealier than start time. Please set again.",
                type: 'error',
            });

        } else if(originalStartMoment.isSame(startMoment) && originalFinishMoment.isSame(finishMoment)) {
            swal({
                title: 'No changes',
                text: "It seems you haven't change the time. Please check again.",
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
                confirmButtonText: 'Yes, update it!',
                preConfirm: function () {
                    return new Promise(function (resolve, reject) {
                        let newTimesheet = new Timesheet();
                        newTimesheet.id = self._updateTimesheet.id;
                        newTimesheet.start_time = self._updateTimesheetStartTime;
                        newTimesheet.finish_time = self._updateTimesheetFinishTime;

                        self._timesheetDataService.updateTimesheetById(newTimesheet).
                            subscribe(
                                result => {
                                    self.getReportTimesheet();
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
        // this._updateTimesheetStartTime = moment("2016-01-01 12:10").format("YYYY-MM-DD HH:mm:ss");
        // this._updateTimesheetFinishTime = moment("2016-01-01 12:30").format("YYYY-MM-DD HH:mm:ss");




    }

    public onClickDelete(timesheet:ReportTimesheetTimesheet, staff:ReportTimesheetStaff) {
        let self = this;
        swal({
            title: 'Are you sure to delete?',
            text: 'Please confirm to delete the timesheet '+timesheet.date+' for '+staff.firstname+'.',
            type: 'question',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    self._timesheetDataService.deleteTimesheetById(timesheet.id).
                    subscribe(
                        result => {
                            self.getReportTimesheet();
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
                })
            }
        }).then(function(result) {
            // handle confirm, result is needed for modals with input

        }, function(dismiss) {
            // dismiss can be "cancel" | "close" | "outside"
        });


    }

    public onChangeDateTime(type:string, dateTime:string) {
        if(type == 'start_time') {
            this._updateTimesheetStartTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        } else if(type == 'finish_time') {
            this._updateTimesheetFinishTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        }
    }
}
