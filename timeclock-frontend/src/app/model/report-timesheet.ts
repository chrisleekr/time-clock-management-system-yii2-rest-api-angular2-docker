export class ReportTimesheetDurations{
    hours:number;
    minutes:number;
    seconds:number;
}

export class ReportTimesheetTimesheet{
    id:number;
    date:string;
    start_time:string;
    finish_time:string;
    start_time_raw:string;
    finish_time_raw:string;
    durations:ReportTimesheetDurations;
    durations_label:string;
    durations_raw:number;
}

export class ReportTimesheetStaff{
    firstname:string;
    lastname:string;
    primary_colour:string;
    lightness:number;
    team_name:string;
    team_primary_colour:string;
    team_lightness:number;
    total_durations:ReportTimesheetDurations;
    total_durations_label:string;
    total_durations_raw:number;
    timesheets:Array<ReportTimesheetTimesheet>;
}

export class ReportTimesheet{
    start_date:string;
    finish_date:string;
    total_durations:ReportTimesheetDurations;
    total_durations_label:string;
    total_durations_raw:number;
    staffs:Array<ReportTimesheetStaff>;
}