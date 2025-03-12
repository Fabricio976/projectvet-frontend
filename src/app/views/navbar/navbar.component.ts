import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  searchQuery = '';
  searchResults: any[] = [];
  showSuggestions = false;
  apiUrl = 'http://localhost:8080/projectvet';
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  navigateToLogin() {
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.closeDropdown();
    this.router.navigate(['/register']);
  }

  navigateToRegisterAnimal() {
    this.router.navigate(['/register-animals']);
    this.closeDropdown();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isDropdownOpen = false;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserName(): string | null {
    return this.authService.getUserName();
  }

  getFirstName(): string | null {
    const fullName = this.getUserName();
    if (fullName) {
      return fullName.split(' ')[0];
    }
    return null;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    if (query.trim()) {
      this.searchSubject.next(query);
      this.showSuggestions = true;
    } else {
      this.searchResults = [];
      this.showSuggestions = false;
    }
  }

  performSearch(query: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token não encontrado');
      return;
    }

    this.http
    .get(`${this.apiUrl}/animal/searchBarra?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
        next: (response: any) => {
          this.searchResults = response;

        },
        error: (error: any) => {
          console.error('Erro na busca:', error);
          this.searchResults = [];
        }
      });
  }

  selectAnimal(animalId: string): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSuggestions = false;
    this.router.navigate(['/profile-animal', animalId]);
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.performSearch(this.searchQuery);
      this.router.navigate(['/home']); 
    }
  }

}
