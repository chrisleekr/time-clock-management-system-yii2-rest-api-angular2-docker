export class Timesheet{
    id:number;
    staff_id:number;
    staff_fullname:string;
    start_time:string;
    finish_time:string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}