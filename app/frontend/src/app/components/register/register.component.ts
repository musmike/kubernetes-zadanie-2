import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card p-4 shadow" style="width: 900px; display: flex; flex-direction: row;">
        
        <!-- Left Side -->
        <div class="bg-dark text-white p-4 d-flex flex-column align-items-center justify-content-center" style="flex: 1;">
          <h2 class="mb-4">Masz już konto?</h2>
          <a routerLink="/login" class="btn btn-light rounded-pill px-4 fw-bold">Zaloguj się</a>
        </div>

        <!-- Right Side -->
        <div class="p-4 d-flex flex-column align-items-center" style="flex: 2;">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="w-100 d-flex flex-column align-items-center">
            <h2 class="mb-4">Stwórz konto</h2>

            <input type="text" class="form-control mb-2 w-75" formControlName="firstName" placeholder="Imię">
            <input type="text" class="form-control mb-2 w-75" formControlName="lastName" placeholder="Nazwisko">
            <input type="email" class="form-control mb-2 w-75" formControlName="email" placeholder="Adres email">
            <input type="password" class="form-control mb-2 w-75" formControlName="password" placeholder="Hasło">

            <div *ngIf="error" class="alert alert-danger w-75 mt-3">{{ error }}</div>

            <button type="submit" class="btn btn-dark rounded-pill px-5 mt-4" [disabled]="registerForm.invalid">
              Zarejestruj się
            </button>
          </form>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.apiService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => this.error = err.error.message || 'Wystąpił błąd'
      });
    }
  }
}