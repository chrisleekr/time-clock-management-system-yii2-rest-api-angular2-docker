export class Team {
    id:number;
    team_name:string;
    primary_colour:string;
    enabled:number;
    enabled_label:string;
    created_at:string;
    updated_at:string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
