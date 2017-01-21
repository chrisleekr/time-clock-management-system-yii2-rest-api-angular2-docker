import { NgModule } from '@angular/core';
import { Routes,
    RouterModule } from '@angular/router';

import { ReportTimesheetComponent } from './report-timesheet.component';

const routes: Routes = [
    {
        path: '',
        component: ReportTimesheetComponent,
        data: {
            title: 'Timesheet'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportTimesheetRoutingModule {}
