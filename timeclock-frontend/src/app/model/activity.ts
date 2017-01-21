export class Activity{
    id:number;
    activity_message:string;
    created_at:string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}