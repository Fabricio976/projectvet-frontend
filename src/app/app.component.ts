import { Component } from '@angular/core';
import { NavbarComponent } from './views/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { NavsComponent } from "./views/nav-lateral/navs.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, NavsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Project Vet';
}
