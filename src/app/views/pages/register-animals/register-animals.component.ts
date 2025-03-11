import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-register-animal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-animals.component.html',
  styleUrls: ['./register-animals.component.css']
})
export class RegisterAnimalsComponent implements OnInit {
  animalForm: FormGroup;
  private apiUrl = 'http://localhost:8080/projectvet';

  servicePetOptions = [
    { value: 'Pet Shop', label: 'Pet Shop' },
    { value: 'Clínica Veterinária', label: 'Clínica Veterinária' },
    { value: 'Clínica e PetShop', label: 'Clínica e PetShop' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.animalForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      race: ['', Validators.required],
      specie: ['', Validators.required],
      responsible: ['', Validators.required],
      servicePet: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  private toTitleCase(str: string | null): string | null {
    if (!str) return null;
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onSubmit(): void {
    if (this.animalForm.valid) {
      const formValue = this.animalForm.value;
      const formData = {
        name: this.toTitleCase(formValue.name),
        age: parseInt(this.animalForm.get('age')?.value),
        race: this.toTitleCase(formValue.race),
        specie: this.toTitleCase(formValue.specie),
        responsible: this.animalForm.get('responsible')?.value,
        servicePet: formValue.servicePet
      };
      const token = localStorage.getItem('token');
      this.http
        .post(`${this.apiUrl}/animal/register`, formData, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'text'
        })
        .subscribe({
          next: () => {
            alert('Animal cadastrado com sucesso!');
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Erro ao cadastrar animal:', error);
            alert('Falha ao cadastrar animal. Verifique os dados e tente novamente.');
          }
        });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}
