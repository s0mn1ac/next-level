import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';

import { AdministrationPage } from './administration.page';

const routes: Routes = [
  {
    path: '',
    component: AdministrationPage
  },
  {
    path: ':id',
    loadChildren: () => import('./pages/user/user-administration.module').then( m => m.UserPageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationPageRoutingModule {}
