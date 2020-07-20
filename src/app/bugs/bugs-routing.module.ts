import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BugsPage } from './bugs.page';

const routes: Routes = [
  {
    path: '',
    component: BugsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BugsPageRoutingModule {}
