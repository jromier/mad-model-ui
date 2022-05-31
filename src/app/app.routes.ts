import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders }               from '@angular/core';

//import { HttpApiComponent } from './http-api/http-api.component';
import { LoginComponent } from './login/login.component';
//import { TrexdApiComponent } from './trexd-api/trexd-api.component';
//import { WebsocketApiComponent } from './websocket-api/websocket-api.component';

export const ROUTES: Routes = [
  { 
    path: 'login',
    component: LoginComponent
  },
  {
    component:  LoginComponent,
    path:       '',
    pathMatch:  'full',
    redirectTo: '',
  },
  {
    component:  LoginComponent,
    path:       '**',
    pathMatch:  'full',
    redirectTo: '',
  },
];
export const routing: ModuleWithProviders<RouterModule> =
RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' });
