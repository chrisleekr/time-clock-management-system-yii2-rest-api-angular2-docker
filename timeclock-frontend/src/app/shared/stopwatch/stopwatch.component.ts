import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {CommonModule}       from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'stopwatch',
    templateUrl: 'stopwatch.component.html',
    styleUrls: ['stopwatch.component.css'],
})
export class StopwatchComponent implements OnInit, OnDestroy{
    public started: boolean;
    public time: number;

    private timer: any;

    private startAt: number;
    private lapTime: number;

    @Input() set startDateTime(startDateTime:string){
        this.startAt = moment(startDateTime).toDate().getTime();
    }

    ngAfterViewChecked() {
    }
    constructor() {
        this.reset();
        this.time = 0;
        this.started = false;

    }

    ngOnInit()    {
    }

    ngOnDestroy() {
        this.stop();
    }

    formatTime(timeMs: number) {

        let hours:string,
            minutes: string,
            seconds: string,
            mSeconds: string;

        let sign:string = '';

        if(timeMs > 0) {
            hours = Math.floor(timeMs / (60 * 60 * 1000)).toString();
        } else {
            timeMs = timeMs * -1;
            hours = '0';
            sign = '-';
        }

        timeMs = timeMs % (60 * 60 * 1000);
        minutes = Math.floor(timeMs / (60 * 1000)).toString();
        timeMs = timeMs % (60 * 1000);
        seconds = Math.floor(timeMs / 1000).toString();
        mSeconds = (timeMs % 1000) + '';
        if(+mSeconds < 10){ mSeconds = '00'+mSeconds; }
        else if(+mSeconds < 100){ mSeconds = '0'+mSeconds; }

        return sign+(+hours < 10 ? '0' : '') + hours + ':' + (+minutes < 10 ? '0' : '') + minutes + ':' + (+seconds < 10 ? '0' : '') + seconds + '.' + mSeconds;

    }

    getUpdate() {
        let self = this;

        let now = moment();
        return () => {
            if(self.time < 0) {
                self.time = this.lapTime
                    - (this.startAt ? this.startAt - this.now() : 0);
            } else {
                self.time = this.lapTime
                    + (this.startAt ? this.now() - this.startAt : 0);
            }
        };
    }


    reset() {
        this.startAt = 0;
        this.lapTime = 0;
        this.started = false;
        this.time = 0;
    }

    now() {
        return moment().toDate().getTime();
    }

    start() {
        this.started = true;
        this.timer = setInterval(this.getUpdate(), 91);
        this.startAt = this.startAt
            ? this.startAt
            : this.now();
    }

    stop() {
        if(this.started) {
            clearInterval(this.timer);
            let timeMs = this.startAt
                ? this.lapTime + this.now() - this.startAt
                : this.lapTime;

            this.lapTime = timeMs;
            this.startAt = 0;
            this.started = false;
        }
    }
}
