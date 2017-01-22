import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {SettingDataService} from "../../model/setting-data.service";
import {Setting} from "../../model/setting";
import {UserService} from "../../model/user.service";

@Component({
    templateUrl: './setting-global-list.component.html',
})
export class SettingGlobalListComponent implements OnInit{
    private _settings:Setting[];
    private _errorMessage:string;

    constructor(private _settingDataService:SettingDataService,
                private _userService:UserService,
                private _router:Router) {}

    ngOnInit() {
        this.getSettings();
    }

    public getSettings() {
        this._settings = null;
        this._settingDataService.getAllSettings()
            .subscribe(
                settings => {
                    this._settings = settings
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
    }

    public viewSetting(setting:Setting):void {
        this._router.navigate(['/setting', 'global', setting.id]);
    }

}

