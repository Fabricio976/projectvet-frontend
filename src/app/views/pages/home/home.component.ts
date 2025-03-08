import { routes } from './../../../app.routes';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router){
  }
  appointments = [
    { user: 'João Silva', animal: 'Rex', date: new Date('2025-03-01'), animalId: 1 },
    { user: 'Maria Oliveira', animal: 'Luna', date: new Date('2025-03-02'), animalId: 2 },
    { user: 'Pedro Santos', animal: 'Max', date: new Date('2025-03-03'), animalId: 3 }
  ]; // Sample data, replace with actual service call

  navigateToProfile(){
    this.router.navigate(['/profile-animal'])
  }
  ngOnInit() {
    // Fetch data from a service here if needed
  }
}
