import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BugsPage } from './bugs.page';

const routes: Routes = [
  {
    path: '',
    component: BugsPage
  },
  {
    path: ':bugid',
    loadChildren: () => import('./bug-details/bug-details.module').then( m => m.BugDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BugsPageRoutingModule {}
