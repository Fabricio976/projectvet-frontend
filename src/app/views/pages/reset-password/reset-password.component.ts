import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup<{
    newPassword: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;
  email: string = '';
  code: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: this.fb.control('', Validators.required),
        confirmPassword: this.fb.control('', Validators.required)
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.code = this.route.snapshot.queryParams['code'] || '';
    console.log('Parâmetros recebidos - Email:', this.email, 'Código:', this.code);
    if (!this.email || !this.code) {
      console.error('Email ou código ausente. Redirecionando para forgot-password.');
      this.router.navigate(['/forgot-password']);
    }
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const { newPassword } = this.resetForm.value;
      this.authService.resetPassword(this.email, this.code, newPassword!).subscribe({
        next: (response) => {
          if (response.message === 'Senha alterada com sucesso!') {
            this.successMessage = 'Senha alterada com sucesso!';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (err) => {
          console.error('Erro ao redefinir senha:', err);
          this.errorMessage = err.error?.message || 'Erro ao redefinir senha. Tente novamente.';
        }
      });
    }
  }
}
