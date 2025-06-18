import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { HomeComponent } from './modules/pages/home/home.component';
import { LoginComponent } from './modules/pages/login/login.component';
import { ProfileComponent } from './modules/pages/profile/profile.component';
import { RegisterAnimalsComponent } from './modules/pages/register-animals/register-animals.component';
import { RegisterComponent } from './modules/pages/register/register.component';
import { VerifyCodeComponent } from './modules/pages/verify-code/verify-code.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch:'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register-animals',
    component: RegisterAnimalsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `profile-animal/:id`,
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,

  },
  {
    path: 'verify-code',
    component: VerifyCodeComponent
  },

];
