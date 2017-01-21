import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import {SettingGlobalComponent} from './setting-global.component';
import {SettingGlobalListComponent} from './setting-global-list.component';
import {SettingGlobalFormComponent} from './setting-global-form.component';
import {SettingGlobalRoutingModule} from './setting-global-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SettingGlobalRoutingModule,
    ],
    declarations: [
        SettingGlobalComponent,
        SettingGlobalListComponent,
        SettingGlobalFormComponent,
    ]
})
export class SettingGlobalModule { }
