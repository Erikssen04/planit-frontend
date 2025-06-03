import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'create-task',
    canActivate: [AuthGuard],
    loadChildren: () => import('./create-task/create-task.module').then( m => m.CreateTaskPageModule)
  },
  {
    path: 'update-task/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./update-task/update-task.module').then(m => m.UpdateTaskPageModule)
  },
  {
    path: 'create-plan',
    canActivate: [AuthGuard],
    loadChildren: () => import('./create-plan/create-plan.module').then( m => m.CreatePlanPageModule)
  },
  {
    path: 'plans',
    canActivate: [AuthGuard],
    loadChildren: () => import('./plans/plans.module').then( m => m.PlansPageModule)
  },
  {
    path: 'update-plan/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./update-plan/update-plan.module').then( m => m.UpdatePlanPageModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'about',
    canActivate: [AuthGuard],
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'change-data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./change-data/change-data.module').then( m => m.ChangeDataPageModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
