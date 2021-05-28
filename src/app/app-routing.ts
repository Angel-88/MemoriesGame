import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full',
  },
  {
    path: 'game',
    loadChildren: () => import('./containers/game/game.module').then(m => m.GameModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./containers/admin/admin.module').then(m => m.AdminModule),
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'}) ],
  exports: [ RouterModule ],
})
export class AppRouting {}
