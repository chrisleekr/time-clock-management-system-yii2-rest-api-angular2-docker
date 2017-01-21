import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { TimeClockComponent } from './time-clock.component';

const routes: Routes = [
  {
    path: '',
    component: TimeClockComponent,
    data: {
      title: 'Time Clock'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeClockRoutingModule {}
