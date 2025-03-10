import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  animals: any[] = [];
  userRole: string | null = null;
  private apiUrl = 'http://localhost:8080/projectvet';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.userRole = this.authService.getUserRole();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAnimals(token);
  }

  loadAnimals(token: string | null): void {
    this.http
      .get(`${this.apiUrl}/animal/searchAll`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .subscribe({
        next: (response: any) => {
          this.animals = response;
        },
        error: (error) => {
          console.error('Erro ao carregar animais:', error);
          alert('Erro ao carregar a lista de animais.');
        }
      });
  }

  navigateToProfile(animalId: string): void {
    this.router.navigate(['/profile-animal', animalId]);
  }
}
