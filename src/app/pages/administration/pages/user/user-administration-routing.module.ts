import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAdministrationPage } from './user-administration.page';

const routes: Routes = [
  {
    path: '',
    component: UserAdministrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAdministrationPageRoutingModule {}
