import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css',
})
export class VerifyCodeComponent implements OnInit {
  verifyForm: FormGroup;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      const { code } = this.verifyForm.value;
      this.authService.verifyCode(this.email, code).subscribe({
        next: (response) => {
          if (response.message === 'Código válido') {
            this.router.navigate(['/reset-password'], {
              queryParams: { email: this.email, code },
            });
          } else {
            alert(response.message);
          }
        },
        error: (err) => {
          console.error('Erro ao verificar código:', err);
          alert('Erro ao verificar código. Tente novamente.');
        },
      });
    }
  }
}
