import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotForm.valid) {
      const { email } = this.forgotForm.value;
      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.successMessage = 'Código enviado para o seu e-mail';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/verify-code'], { queryParams: { email } })
              .then(() => console.log('Redirecionamento concluído'))
              .catch(err => console.error('Erro ao redirecionar:', err));
          }, 3000);
        },
        error: (err) => {
          console.error('Erro ao solicitar código:', err);
          this.errorMessage = 'Erro ao solicitar código. Tente novamente.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      });
    }
  }
}
