import {Component, Input} from '@angular/core';



@Component({
    selector: 'clock',
    templateUrl: 'clock.component.html',
    styleUrls: ['clock.component.css'],
})
export class ClockComponent {
    private _clockData;
    private _dateFormat;
    private _timeFormat;
    private _showDate;
    private _milliseconds;

    @Input() set showDate(showDate:boolean){
        this._showDate = showDate;
    }

    @Input() set dateFormat(formatName:string){
        this._dateFormat = formatName;
    }

    @Input() set timeFormat(formatName:string){
        this._timeFormat = formatName;
    }

    constructor() {
        this._milliseconds = 1000; // milli seconds

        // this.format = 'hh:mm:s';
        this._clockData = new Date();

        window.setTimeout(()=>{
            this.refreshTime();
        }, this._milliseconds);
    }

    public refreshTime():void {
        this._clockData = new Date();
        window.setTimeout(()=>{
            this.refreshTime();
        }, this._milliseconds);
    }

}