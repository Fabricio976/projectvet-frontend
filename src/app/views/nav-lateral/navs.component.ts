import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navs',
  imports: [CommonModule, RouterModule],
  templateUrl: './navs.component.html',
  styleUrl: './navs.component.css'
})
export class NavsComponent {

  constructor(private router: Router){}

  navigateToHome(){
    this.router.navigate(['/home'])
  }
}
