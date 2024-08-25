import {NgModule} from '@angular/core';
import {RouterModule, type Routes} from '@angular/router';
import {ClienteComponent} from './cliente/cliente.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {RistoratoreComponent} from './ristoratore/ristoratore.component';
import {RiderComponent} from './rider/rider.component';
import {RegistrazioneComponent} from "./registrazione/registrazione.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cliente',
    pathMatch: 'full',
  },
  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [AuthGuard],
    data: {roles: ['CLIENTE']}
  },
  {
    path: 'ristoratore',
    component: RistoratoreComponent,
    canActivate: [AuthGuard],
    data: {roles: ['RISTORATORE']}
  },
  {
    path: 'rider',
    component: RiderComponent,
    canActivate: [AuthGuard],
    data: {roles: ['RIDER']}
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegistrazioneComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
