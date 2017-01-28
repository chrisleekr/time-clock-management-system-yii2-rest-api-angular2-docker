import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';


import {FormsModule, ReactiveFormsModule}        from '@angular/forms';
import {MomentModule} from 'angular2-moment';
import {MyDateRangePickerModule} from 'mydaterangepicker';
import {ModalModule} from 'ng2-bootstrap/modal';
import {ColorPickerModule} from 'angular2-color-picker';

import {ClockComponent} from './clock/clock.component';
import {StopwatchComponent} from './stopwatch/stopwatch.component';
import {TimepickerComponent} from './timepicker/timepicker.component';
import {LimitToPipe} from './limit-to.pipe';
import {Nl2BrPipe} from './nl2br.pipe';


@NgModule({
    imports:      [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        MyDateRangePickerModule,
        ModalModule,
        ColorPickerModule,
    ],
    declarations: [
        ClockComponent,
        TimepickerComponent,
        StopwatchComponent,
        LimitToPipe,
        Nl2BrPipe,
    ],
    exports:      [
        FormsModule,
        ReactiveFormsModule,
        ClockComponent,
        TimepickerComponent,
        StopwatchComponent,
        LimitToPipe,
        ModalModule,
        MyDateRangePickerModule,
        MomentModule,
        ColorPickerModule,
        Nl2BrPipe,
    ],
    providers:    [

    ]
})
export class SharedModule { }