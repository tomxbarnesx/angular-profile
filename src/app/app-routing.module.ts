import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  { 
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  },
  { 
    path: 'about', 
    component: AboutComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
