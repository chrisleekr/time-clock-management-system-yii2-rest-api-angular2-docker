import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import {ReportTimesheetComponent} from './report-timesheet.component';
import {ReportTimesheetRoutingModule} from './report-timesheet-routing.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReportTimesheetRoutingModule,
    ],
    declarations: [
        ReportTimesheetComponent,
    ],
    providers: [

    ]
})
export class ReportTimesheetModule { }
