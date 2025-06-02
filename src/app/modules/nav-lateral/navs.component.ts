import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AnimalFilterService } from '../../service/animal.filter.service';

@Component({
  selector: 'app-navs',
  imports: [CommonModule, RouterModule],
  templateUrl: './navs.component.html',
  styleUrl: './navs.component.css'
})
export class NavsComponent {

  constructor(
    private router: Router,
    private animalFilterService: AnimalFilterService
  ){}

  navigateToHome(){
    this.router.navigate(['/home'])
  }

  filterAnimals(servicePet: string): void {
    this.animalFilterService.setFilter(servicePet);
    this.navigateToHome();
  }

  showAllAnimals(): void {
    this.animalFilterService.setFilter(null);
    this.navigateToHome();
  }
}
