import {NgModule} from '@angular/core';
import {CommonModule}       from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import {TimeClockComponent} from './time-clock.component';
import {TimeClockRoutingModule} from './time-clock-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TimeClockRoutingModule,
    ],
    declarations: [
        TimeClockComponent,
    ]
})
export class TimeClockModule {}
