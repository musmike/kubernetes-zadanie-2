import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container px-5">
        <a class="navbar-brand" routerLink="/">Wędkarstwo naszą pasją</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link px-lg-3 py-3 py-lg-4" routerLink="/home" routerLinkActive="active">Strona główna</a></li>
            <li class="nav-item"><a class="nav-link px-lg-3 py-3 py-lg-4" routerLink="/reviews" routerLinkActive="active">Opinie</a></li>
            <li class="nav-item"><a class="nav-link px-lg-3 py-3 py-lg-4" routerLink="/about" routerLinkActive="active">O nas</a></li>
            <li class="nav-item"><a class="nav-link px-lg-3 py-3 py-lg-4" routerLink="/contact" routerLinkActive="active">Kontakt</a></li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li *ngIf="!user" class="nav-item"><a class="nav-link" routerLink="/login">Zaloguj się</a></li>
            <li *ngIf="!user" class="nav-item"><a class="nav-link" routerLink="/register">Zarejestruj się</a></li>
            
            <li *ngIf="user" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown">{{ user.name }}</a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" routerLink="/profile">Edytuj profil</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#" (click)="logout($event)">Wyloguj się</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: ['.navbar-brand { font-weight: 800; }']
})
export class NavbarComponent {
  user: any;

  constructor(private apiService: ApiService) {
    this.user = this.apiService.getUser();
  }

  logout(event: Event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}