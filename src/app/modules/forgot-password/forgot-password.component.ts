import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
  if (this.forgotForm.valid) {
    this.isLoading = true; // Mostra o spinner
    const { email } = this.forgotForm.value;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.successMessage = 'Código enviado para o seu e-mail';
        setTimeout(() => {
          this.successMessage = null;
          this.isLoading = false; // Esconde o spinner
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
          this.isLoading = false; // Esconde o spinner
        }, 2000);
      }
    });
  }
}
}
