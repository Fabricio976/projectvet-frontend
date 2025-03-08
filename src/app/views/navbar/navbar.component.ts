import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDropdownOpen = false;

  constructor(private router: Router, private elementRef: ElementRef, private authService: AuthService) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  navigateToHome(){
    this.router.navigate(['/home'])
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile-animal']);
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

  navigateToRegisterAnimal(): void {
    this.router.navigate(['/registrar-animals']);
    this.isDropdownOpen = false;
  }

  logout(): void {
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

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }


}
