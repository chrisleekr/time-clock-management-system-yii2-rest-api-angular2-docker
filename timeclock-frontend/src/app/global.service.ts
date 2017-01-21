import {Injectable} from '@angular/core';
import * as moment from "moment";
import {environment} from '../environments/environment';


@Injectable()
export class GlobalService{
    public apiHost:string;

    public timezone:string = 'Australia/Melbourne';
    public rounding_times:number = 5;
    public week_start_on:string = 'Tuesday';

    constructor(){
        if(environment.production == true) {
            this.apiHost = 'http://localhost:4201/v1';
        } else {
            this.apiHost = 'http://localhost:4201/v1';
        }
    }

    loadGlobalSettingsFromLocalStorage():void{
        if(localStorage.getItem('timezone') != null){
            this.timezone = localStorage.getItem('timezone');
        }
        if(localStorage.getItem('rounding_times') != null){
            this.rounding_times = +localStorage.getItem('rounding_times');
        }
        if(localStorage.getItem('week_start_on') != null){
            this.week_start_on = localStorage.getItem('week_start_on');
        }
    }

    getWeekStartOn():any{
        // get day of week starting on
        let weekStartOn = this.week_start_on;

        let weekStartOnNumber:number;
        let weekStartOnShort:string;

        switch(weekStartOn.toLowerCase()) {
            case 'sunday':
                weekStartOnNumber = 0;
                weekStartOnShort = 'su';
                break;
            case 'monday':
                weekStartOnNumber = 1;
                weekStartOnShort = 'mo';
                break;
            case 'tuesday':
                weekStartOnNumber = 2;
                weekStartOnShort = 'tu';
                break;
            case 'wednesday':
                weekStartOnNumber = 3;
                weekStartOnShort = 'we';
                break;
            case 'thursday':
                weekStartOnNumber = 4;
                weekStartOnShort = 'th';
                break;
            case 'friday':
                weekStartOnNumber = 5;
                weekStartOnShort = 'fr';
                break;
            case 'saturday':
                weekStartOnNumber = 6;
                weekStartOnShort = 'sa';
                break;
        }

        return {
            'week_start_on_number': weekStartOnNumber,
            'week_start_on_short': weekStartOnShort,
        }
    }

    getInitialStartFinishDate() {
        let tmpWeek = this.getWeekStartOn();

        let weekStartOnNumber:number = tmpWeek.week_start_on_number;

        // calculate start, finish date.
        let today = moment();
        let todayNumber = today.day();
        let startDate, finishDate, diffDays;
        if(todayNumber == weekStartOnNumber) {
            // today is starting of new week
            // so use today as start and finish day
            startDate = moment(today);
            finishDate = moment(today);
        } else if(todayNumber < weekStartOnNumber) {
            diffDays = 7 - weekStartOnNumber + todayNumber;
            finishDate = moment(today);
            startDate = moment(today);
            startDate = startDate.subtract(diffDays, 'days');
        } else if(todayNumber > weekStartOnNumber) {
            diffDays = todayNumber - weekStartOnNumber;
            startDate = moment(today);
            startDate = startDate.subtract(diffDays, 'days');
            finishDate = moment(today);
        }
        return {
            'start_date': startDate,
            'finish_date': finishDate,
        }
    }

}