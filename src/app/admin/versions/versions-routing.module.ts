import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VersionsPage } from './versions.page';

const routes: Routes = [
  {
    path: '',
    component: VersionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VersionsPageRoutingModule {}
