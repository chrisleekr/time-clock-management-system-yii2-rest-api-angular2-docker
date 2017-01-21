import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';


import {AppComponent} from './app.component';
import {DropdownModule} from 'ng2-bootstrap/dropdown';
import {ModalModule} from 'ng2-bootstrap/modal';
import {TabsModule} from 'ng2-bootstrap/tabs';

import {BreadcrumbsComponent} from './shared/breadcrumb.component';
import {SmartResizeDirective} from './shared/smart-resize.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
import { AsideToggleDirective } from './shared/aside.directive';

// Routing Module
import {AppRoutingModule} from './app.routing';

// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {SimpleLayoutComponent} from './layouts/simple-layout.component';
import {P404Component} from './pages/404.component';

// Shared
import {LoggedInGuard} from './login/logged-in.guard';
import {SharedModule} from './shared/shared.module';

// Model & Services
import {GlobalService} from './global.service';
import {UserService} from './model/user.service';
import {TeamDataService} from './model/team-data.service';
import {StaffDataService} from './model/staff-data.service';
import {TimesheetDataService} from './model/timesheet-data.service';
import {SettingDataService} from './model/setting-data.service';
import {ReportDataService} from "./model/report-data.service";
import {ActivityDataService} from "./model/activity-data.service";

@NgModule({
    imports: [
        BrowserModule,
        // FormsModule,
        // ReactiveFormsModule,
        AppRoutingModule,
        DropdownModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        // MomentModule,
        HttpModule,
        SharedModule,
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        SimpleLayoutComponent,
        BreadcrumbsComponent,
        SmartResizeDirective,
        P404Component,
        NAV_DROPDOWN_DIRECTIVES,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        LoggedInGuard,
        UserService,
        GlobalService,
        TeamDataService,
        StaffDataService,
        TimesheetDataService,
        SettingDataService,
        ReportDataService,
        ActivityDataService,
    ],
    bootstrap: [AppComponent],
    exports: [
    ],
})
export class AppModule { }
