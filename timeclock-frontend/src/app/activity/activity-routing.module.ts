import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ActivityComponent} from './activity.component';

const routes: Routes = [
    {
        path: '',
        component: ActivityComponent,
        data: {
            title: 'Activities'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityRoutingModule {
}
