import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, ValidationErrors, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss',
})
export class VerifyCodeComponent implements OnInit {
  formGroup: FormGroup;
  email: string = '';
  code: string = '';
  step: number = 1;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formGroup = this.fb.group<{
      code: FormControl<string | null>;
      newPassword: FormControl<string | null>;
      confirmPassword: FormControl<string | null>;
    }>(
      {
        code: this.fb.control('', Validators.required),
        newPassword: this.fb.control('', Validators.required),
        confirmPassword: this.fb.control('', Validators.required),
      },
      {
        validators: this.passwordMatchValidator as ValidatorFn
      }
    );

  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  };

  verifyCode(): void {
    const code = this.formGroup.get('code')?.value;
    this.authService.verifyCode(this.email, code).subscribe({
      next: (response) => {
        if (response.message === 'Código válido') {
          this.code = code;
          this.step = 2;
        } else {
          alert(response.message);
        }
      },
      error: (err) => {
        console.error('Erro ao verificar código:', err);
        alert('Erro ao verificar código. Tente novamente.');
      }
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    if (!this.email) {
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.formGroup.valid && this.step === 2) {
      const { newPassword } = this.formGroup.value;
      this.authService.resetPassword(this.email, this.code, newPassword).subscribe({
        next: (response) => {
          if (response.message === 'Senha alterada com sucesso!') {
            alert('Senha redefinida com sucesso!');
            this.router.navigate(['/login']);
          } else {
            alert(response.message);
          }
        },
        error: (err) => {
          console.error('Erro ao redefinir senha:', err);
          alert('Erro ao redefinir senha. Tente novamente.');
        }
      });
    }
  }
}
