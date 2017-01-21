import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Settings'
        },
        children: [
            {
                path: 'global',
                loadChildren: 'app/setting/global/setting-global.module#SettingGlobalModule'
            },
            {
                path: 'team',
                loadChildren: 'app/setting/team/setting-team.module#SettingTeamModule'
            },
            {
                path: 'staff',
                loadChildren: 'app/setting/staff/setting-staff.module#SettingStaffModule'
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'global',
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingRoutingModule {}
