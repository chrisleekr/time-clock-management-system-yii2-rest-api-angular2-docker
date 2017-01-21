import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CustomValidators} from 'ng2-validation';

import {SettingDataService} from "../../model/setting-data.service";
import {Setting} from "../../model/setting";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../model/user.service";
import {GlobalService} from "../../global.service";

@Component({
    templateUrl: './setting-global-form.component.html',
})
export class SettingGlobalFormComponent implements OnInit, OnDestroy{
    private _mode = '';

    private _id:number;
    private _parameters:any;
    private _setting:Setting;
    private _errorMessage:string;

    private _form:FormGroup;
    private _formErrors:any;
    private _submitted:boolean = false;


    constructor(private _settingDataService:SettingDataService,
                private _globalService:GlobalService,
                private _router:Router,
                private _activatedRoute:ActivatedRoute,
                private _formBuilder:FormBuilder,
                private _userService:UserService) {



        this._form = _formBuilder.group({
            meta_value: ['', Validators.compose([Validators.required])],
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
            meta_value: {valid: true, message: ''},
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

    private _resetSetting(){
        this._setting = new Setting();
        this._setting.meta_value = '';
    }

    public ngOnInit() {
        this._resetFormErrors();
        this._resetSetting();

        // _route is activated route service. this._route.params is observable.
        // subscribe is method that takes function to retrieve parameters when it is changed.
        this._parameters = this._activatedRoute.params.subscribe(params => {
            // plus(+) is to convert 'id' to number
            if(typeof params['id'] !== "undefined") {
                this._id = Number.parseInt(params['id']);
                this._errorMessage = "";

                this._settingDataService.getSettingById(this._id)
                    .subscribe(
                        setting => {
                            this._setting = setting;
                            this._mode = 'update';

                            try{
                                this._setting.meta_attribute = JSON.parse(this._setting.meta_attribute);
                            } catch(e){
                                this._setting.meta_attribute = {};
                            }
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
        this._setting = new Setting();
    }

    public onSubmit() {
        this._submitted = true;
        this._resetFormErrors();
        if(this._mode == 'create') {
            // this._settingDataService.addSetting(this._setting)
            //     .subscribe(
            //         result => {
            //             if(result.success) {
            //                 this._router.navigate(['/setting/setting']);
            //             } else {
            //                 this._submitted = false;
            //             }
            //         },
            //         error => {
            //             this._submitted = false;
            //             // Validation errors
            //             if(error.status == 422) {
            //                 this._setFormErrors(error.data);
            //             }
            //             // Unauthorized Access
            //             else if(error.status == 401) {
            //                 this._userService.unauthorizedAccess(error);
            //             }
            //             // All other errors
            //             else {
            //                 this._errorMessage = error.data.message;
            //             }
            //         }
            //     );
        } else if(this._mode == 'update') {
            let tmpSetting:Setting = new Setting();
                tmpSetting.id = this._setting.id;
                tmpSetting.meta_value = this._setting.meta_value+"";

            this._settingDataService.updateSettingById(tmpSetting)
                .subscribe(
                    result => {
                        if(result.success) {
                            this._settingDataService.refreshGlobalSettings();
                            this._router.navigate(['/setting/global']);
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

