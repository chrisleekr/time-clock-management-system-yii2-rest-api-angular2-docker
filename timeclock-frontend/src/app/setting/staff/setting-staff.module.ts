import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import {SettingStaffListComponent} from './setting-staff-list.component';
import {SettingStaffFormComponent} from './setting-staff-form.component';
import {SettingStaffRoutingModule} from './setting-staff-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SettingStaffRoutingModule,
    ],
    declarations: [
        SettingStaffListComponent,
        SettingStaffFormComponent,
    ]
})
export class SettingStaffModule { }
