import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import {ActivityComponent} from './activity.component';
import {ActivityRoutingModule} from './activity-routing.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ActivityRoutingModule,
    ],
    declarations: [
        ActivityComponent,
    ],
    providers: [

    ]
})
export class ActivityModule { }
