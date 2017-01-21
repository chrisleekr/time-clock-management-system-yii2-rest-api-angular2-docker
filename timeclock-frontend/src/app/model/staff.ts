import {Team} from "./team";

export class Staff{
    id:number;
    team_id:number;
    fullname:string;
    firstname:string;
    lastname:string;
    email_address?:string;
    primary_colour:string;
    enabled:number;
    enabled_label:string;
    created_at:string;
    updated_at:string;
    team:Team;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}