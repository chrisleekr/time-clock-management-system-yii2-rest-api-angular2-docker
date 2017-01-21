import {Timesheet} from "./timesheet";
export class StaffTimesheet{
    id:number;
    team_name:string;
    fullname:string;
    primary_colour:string;
    is_clocked_in:number;
    lightness:number;
    current_timesheet?:Timesheet;
    last_timesheet?:Timesheet;

    constructor(values: Object = {}){
        Object.assign(this, values);
    }
}