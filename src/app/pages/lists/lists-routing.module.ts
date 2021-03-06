import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';

import { ListsPage } from './lists.page';

const routes: Routes = [
  {
    path: '',
    component: ListsPage
  },
  {
    path: ':id',
    loadChildren: () => import('./pages/list/list.module').then( m => m.ListPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListsPageRoutingModule {}
