import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ColorPickerService} from 'angular2-color-picker';
import {CustomValidators} from 'ng2-validation';

import {TeamDataService} from "../../model/team-data.service";
import {Team} from "../../model/team";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../model/user.service";

@Component({
    templateUrl: './setting-team-form.component.html',
})
export class SettingTeamFormComponent implements OnInit, OnDestroy{
    private _mode = '';

    private _id:number;
    private _parameters:any;
    private _team:Team;
    private _errorMessage:string;

    private _form:FormGroup;
    private _formErrors:any;
    private _submitted:boolean = false;


    constructor(private _teamDataService:TeamDataService,
                private _router:Router,
                private _activatedRoute:ActivatedRoute,
                private _formBuilder:FormBuilder,
                private _colorPickerService:ColorPickerService,
                private _userService:UserService) {



        this._form = _formBuilder.group({
            team_name: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
            primary_colour: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(7)])],
            enabled: [1, Validators.compose([Validators.required, CustomValidators.range([0, 1])])],
        });
        this._form.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }



    private _setFormErrors(errorFields:any):void{
        for (let key in errorFields) {
            let errorField = errorFields[key];
            // skip loop if the property is from prototype
            if (!this._formErrors.hasOwnProperty(errorField.field)) continue;

            // let message = errorFields[error.field];
            this._formErrors[errorField.field].valid = false;
            this._formErrors[errorField.field].message = errorField.message;
        }
    }

    private _resetFormErrors():void{
        this._formErrors = {
            team_name: {valid: true, message: ''},
            primary_colour: {valid: true, message: ''},
            enabled: {valid: true, message: ''},
        };
    }

    private _isValid(field):boolean {
        return this._form.controls[field].valid && this._formErrors[field].valid == true;
    }

    public onValueChanged(data?: any) {
        if (!this._form) { return; }
        const form = this._form;
        for (let field in this._formErrors) {
            // clear previous error message (if any)
            let control = form.get(field);
            if (control && control.dirty) {
                this._formErrors[field].valid = true;
                this._formErrors[field].message = '';
            }
        }
    }

    private _resetTeam(){
        this._team = new Team();
        this._team.team_name = '';
        this._team.primary_colour = '#000000';
        this._team.enabled = 1;

    }

    public ngOnInit() {
        this._resetFormErrors();
        this._resetTeam();

        // _route is activated route service. this._route.params is observable.
        // subscribe is method that takes function to retrieve parameters when it is changed.
        this._parameters = this._activatedRoute.params.subscribe(params => {
            // plus(+) is to convert 'id' to number
            if(typeof params['id'] !== "undefined") {
                this._id = Number.parseInt(params['id']);
                this._errorMessage = "";

                this._teamDataService.getTeamById(this._id)
                    .subscribe(
                        team => {
                            this._team = team;
                            this._mode = 'update';
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
            } else {
                this._mode = 'create';
            }
        });
    }

    public ngOnDestroy() {
        this._parameters.unsubscribe();
        this._team = new Team();
    }

    public onSubmit() {
        this._submitted = true;
        this._resetFormErrors();
        if(this._mode == 'create') {
            this._teamDataService.addTeam(this._team)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._router.navigate(['/setting/team']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if(error.status == 422) {
                            this._setFormErrors(error.data);
                        }
                        // Unauthorized Access
                        else if(error.status == 401) {
                            this._userService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        } else if(this._mode == 'update') {
            this._teamDataService.updateTeamById(this._team)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._router.navigate(['/setting/team']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if(error.status == 422) {
                            this._setFormErrors(error.data);
                        }
                        // Unauthorized Access
                        else if(error.status == 401) {
                            this._userService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        }
    }


}

