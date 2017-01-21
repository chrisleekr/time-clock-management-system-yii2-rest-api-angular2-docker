import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Reports'
        },
        children: [
            {
                path: 'timesheet',
                loadChildren: 'app/report/timesheet/report-timesheet.module#ReportTimesheetModule'
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'timesheet',
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule {}
