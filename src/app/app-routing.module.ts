import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'information',
    loadChildren: () => import('./pages/information/information.module').then( m => m.InformationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'board',
    loadChildren: () => import('./pages/board/board.module').then( m => m.BoardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/lists/lists.module').then( m => m.ListsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'library',
    loadChildren: () => import('./pages/library/library.module').then( m => m.LibraryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'game',
    loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'administration',
    loadChildren: () => import('./pages/administration/administration.module').then( m => m.AdministrationPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
