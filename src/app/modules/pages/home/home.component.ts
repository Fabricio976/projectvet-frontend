import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalFilterService } from '../../../service/animal.filter.service';

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
  filteredAnimals: any[] = [];
  userRole: string | null = null;
  private apiUrl = 'http://localhost:8080/projectvet';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private animalFilterService: AnimalFilterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.userRole = this.authService.getUserRole();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAnimals(token);

    this.animalFilterService.filter$.subscribe(servicePet => {
      this.applyFilter(servicePet);
    });
  }

  loadAnimals(token: string | null): void {
    this.http
      .get(`${this.apiUrl}/animal/searchAll`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .subscribe({
        next: (response: any) => {
          this.animals = response;
          this.filteredAnimals = [...this.animals];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar animais:', error);
          alert('Erro ao carregar a lista de animais.');
        }
      });
  }

  applyFilter(servicePet: string | null): void {
    if (servicePet) {
      this.filteredAnimals = this.animals.filter(animal =>
        animal.servicePet === servicePet
      );
    } else {
      this.filteredAnimals = [...this.animals];
    }
    this.cdr.detectChanges();
  }

  navigateToProfile(animalId: string): void {
    this.router.navigate(['/profile-animal', animalId]);
  }
}
