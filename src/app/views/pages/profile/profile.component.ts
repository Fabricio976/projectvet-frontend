import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-animal-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  animal: any = null;
  private apiUrl = 'http://localhost:8080/projectvet';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!this.authService.isLoggedIn()) {
      console.log('Usuário não logado, redirecionando para /login');
      this.router.navigate(['/login']);
      return;
    }

    const animalId = this.route.snapshot.paramMap.get('id');
    if (animalId) {
      this.loadAnimal(animalId, token);
    }
  }

  loadAnimal(animalId: string, token: string | null): void {
    if (!token) {
      return;
    }

    this.http
      .get(`${this.apiUrl}/animal/search/${animalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .subscribe({
        next: (response: any) => {
          this.animal = response;
        },
        error: (error) => {
          console.error('Erro ao carregar animal:', error);
          alert('Erro ao carregar o perfil do animal.');
        }
      });
  }


}
