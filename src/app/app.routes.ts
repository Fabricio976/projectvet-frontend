import { Routes } from '@angular/router';
import { HomeComponent } from './views/pages/home/home.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { RegisterAnimalsComponent } from './views/pages/register-animals/register-animals.component';
import { ProfileComponent } from './views/pages/profile/profile.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './views/pages/reset-password/reset-password.component';
import { VerifyCodeComponent } from './views/pages/verify-code/verify-code.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
  },
  {
    path: `profile-animal`,
    component: ProfileComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'verify-code',
    component: VerifyCodeComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
];
