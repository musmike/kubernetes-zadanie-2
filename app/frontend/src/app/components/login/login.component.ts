import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card p-4 shadow" style="width: 400px;">
        <h2 class="text-center mb-4">Zaloguj się</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <input type="email" class="form-control" formControlName="email" placeholder="Email">
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" formControlName="password" placeholder="Hasło">
          </div>
          
          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
          
          <button type="submit" class="btn btn-dark w-100" [disabled]="loginForm.invalid">Zaloguj się</button>
        </form>
        
        <div class="mt-3 text-center">
          <p>Nie masz konta? <a routerLink="/register">Zarejestruj się</a></p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.data);
          window.location.href = '/'; 
        },
        error: (err) => {
          this.error = err.error.message || 'Wystąpił błąd';
        }
      });
    }
  }
}