import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './auth/authentication.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
