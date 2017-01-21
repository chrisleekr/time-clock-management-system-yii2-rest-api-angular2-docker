import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ColorPickerService} from 'angular2-color-picker';
import {CustomValidators} from 'ng2-validation';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";


import {StaffDataService} from "../../model/staff-data.service";
import {Staff} from "../../model/staff";
import {UserService} from "../../model/user.service";
import {Team} from "../../model/team";
import {TeamDataService} from "../../model/team-data.service";

@Component({
    templateUrl: './setting-staff-form.component.html',
})
export class SettingStaffFormComponent implements OnInit, OnDestroy{
    private _mode = '';

    private _id:number;
    private _parameters:any;
    private _staff:Staff;
    private _teams:Team[];
    private _defaultTeamId:number;

    private _errorMessage:string;

    private _form:FormGroup;
    private _formErrors:any;
    private _submitted:boolean = false;


    constructor(private _staffDataService:StaffDataService,
                private _teamDataService:TeamDataService,
                private _userService:UserService,
                private _router:Router,
                private _activatedRoute:ActivatedRoute,
                private _formBuilder:FormBuilder,
                private _colorPickerService:ColorPickerService) {

        let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';


        // Get teams
        this._teamDataService.getAllTeams()
            .subscribe(
                teams => {
                    this._teams = teams;
                },
                error =>  {
                    // unauthorized access
                    if(error.status == 401) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        this._errorMessage = error.data.message;
                    }
                }
            );

        // Construct form group
        this._form = _formBuilder.group({
            team_id: [0, Validators.compose([Validators.required, CustomValidators.min(1)])],
            firstname: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            lastname: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            email_address: ['', Validators.compose([Validators.pattern(emailRegex), CustomValidators.email])],
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
            team_id: {valid: true, message: ''},
            firstname: {valid: true, message: ''},
            lastname: {valid: true, message: ''},
            email_address: {valid: true, message: ''},
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

    private _resetStaff(){
        this._staff = new Staff();
        this._staff.team_id = 0;
        this._staff.firstname = '';
        this._staff.lastname = '';
        this._staff.email_address = '';
        this._staff.primary_colour = '#000000';
        this._staff.enabled = 1;

    }

    public ngOnInit() {
        this._resetFormErrors();
        this._resetStaff();




        // _route is activated route service. this._route.params is observable.
        // subscribe is method that takes function to retrieve parameters when it is changed.
        this._parameters = this._activatedRoute.params.subscribe(params => {
            // plus(+) is to convert 'id' to number
            if(typeof params['id'] !== "undefined") {
                this._id = Number.parseInt(params['id']);
                this._errorMessage = "";
                this._staffDataService.getStaffById(this._id)
                    .subscribe(
                        staff => {
                            this._staff = staff;
                            this._mode = 'update';

                            this._defaultTeamId = this._staff.team_id;
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
        this._staff = new Staff();
    }

    public onSubmit() {
        this._submitted = true;
        this._resetFormErrors();
        if(this._mode == 'create') {
            this._staffDataService.addStaff(this._staff)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._router.navigate(['/setting', 'staff']);
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
            this._staffDataService.updateStaffById(this._staff)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._router.navigate(['/setting', 'staff']);
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

