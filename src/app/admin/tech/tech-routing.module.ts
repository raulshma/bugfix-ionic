import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechPage } from './tech.page';

const routes: Routes = [
  {
    path: '',
    component: TechPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechPageRoutingModule {}
