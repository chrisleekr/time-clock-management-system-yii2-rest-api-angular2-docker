import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {SimpleLayoutComponent} from './layouts/simple-layout.component';
import {P404Component} from './pages/404.component';

import {LoggedInGuard} from './login/logged-in.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: FullLayoutComponent,
        data: {
            title: 'Home'
        },
        canActivate: [LoggedInGuard],
        canActivateChild: [LoggedInGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'time-clock',
                loadChildren: 'app/time-clock/time-clock.module#TimeClockModule'
            },
            {
                path: 'report',
                loadChildren: 'app/report/report.module#ReportModule'
            },
            {
                path: 'activity',
                loadChildren: 'app/activity/activity.module#ActivityModule'
            },
            {
                path: 'setting',
                loadChildren: 'app/setting/setting.module#SettingModule'
            }
        ]
    },
    {
        path: '',
        component:SimpleLayoutComponent,
        children: [
            {
                path: 'login',
                loadChildren: 'app/login/login.module#LoginModule'
            },
            {
                path: 'logout',
                loadChildren: 'app/logout/logout.module#LogoutModule'
            }
        ],
    },
    // otherwise redirect to home
    { path: '**', component: P404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
