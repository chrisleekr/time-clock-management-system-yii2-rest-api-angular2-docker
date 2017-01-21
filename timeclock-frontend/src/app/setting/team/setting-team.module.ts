import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import {SettingTeamComponent} from './setting-team.component';
import {SettingTeamListComponent} from './setting-team-list.component';
import {SettingTeamFormComponent} from './setting-team-form.component';
import {SettingTeamRoutingModule} from './setting-team-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SettingTeamRoutingModule,
    ],
    declarations: [
        SettingTeamComponent,
        SettingTeamListComponent,
        SettingTeamFormComponent,
    ]
})
export class SettingTeamModule { }
