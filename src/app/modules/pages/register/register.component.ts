import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../service/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CustomValidators } from '../../../models/interfaces/validator/custaom-validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  step = 1;
  registerForm: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cpf: ['', [Validators.required, CustomValidators.cpfValidator()]],
      phone: ['', [Validators.required, CustomValidators.phoneValidator()]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },{ validators: CustomValidators.passwordMatchValidator} );
  }

nextStep(): void {
    if (this.step === 1) {
      const firstNameControl = this.registerForm.get('firstName');
      const lastNameControl = this.registerForm.get('lastName');
      if (firstNameControl?.valid && lastNameControl?.valid) {
        this.step++;
      } else {
        firstNameControl?.markAsTouched();
        lastNameControl?.markAsTouched();
      }
    } else if (this.step === 2) {
      const cpfControl = this.registerForm.get('cpf');
      const addressControl = this.registerForm.get('address');
      const phoneControl = this.registerForm.get('phone');
      if (cpfControl?.valid && addressControl?.valid && phoneControl?.valid) {
        this.step++;
      } else {
        cpfControl?.markAsTouched();
        addressControl?.markAsTouched();
        phoneControl?.markAsTouched();
      }
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password, cpf, address, phone } = this.registerForm.value;
      const formData = {
        name: `${firstName} ${lastName}`,
        email,
        password,
        cpf,
        address,
        phone
      };

      this.authService.register(formData).subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => alert('Falha no registro. Verifique os dados e tente novamente.')
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}
