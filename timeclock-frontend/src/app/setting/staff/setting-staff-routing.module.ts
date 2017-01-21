import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SettingStaffListComponent} from './setting-staff-list.component';
import {SettingStaffFormComponent} from './setting-staff-form.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Staffs'
        },
        children: [
            {
                path: 'list',
                component: SettingStaffListComponent,
                data: {
                    title: 'List'
                }
            },
            {
                path: 'create',
                component: SettingStaffFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: SettingStaffFormComponent,
                data: {
                    title: 'Update'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingStaffRoutingModule {}
