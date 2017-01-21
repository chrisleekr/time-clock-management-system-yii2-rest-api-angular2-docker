import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SettingTeamListComponent} from './setting-team-list.component';
import {SettingTeamFormComponent} from './setting-team-form.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Teams'
        },
        children: [
            {
                path: 'list',
                component: SettingTeamListComponent,
                data: {
                    title: 'List'
                }
            },
            {
                path: 'create',
                component: SettingTeamFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: SettingTeamFormComponent,
                data: {
                    title: 'Update'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingTeamRoutingModule {}
