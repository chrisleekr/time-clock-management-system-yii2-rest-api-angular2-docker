import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}
