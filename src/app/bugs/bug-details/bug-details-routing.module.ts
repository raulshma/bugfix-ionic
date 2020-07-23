import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BugDetailsPage } from './bug-details.page';

const routes: Routes = [
  {
    path: '',
    component: BugDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BugDetailsPageRoutingModule {}
