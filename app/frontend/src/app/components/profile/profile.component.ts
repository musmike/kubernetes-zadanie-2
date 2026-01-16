import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { CustomModalComponent } from '../shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CustomModalComponent],
  template: `
    <div class="container mt-5 mb-5" style="max-width: 600px;">
      <div class="card p-4 bg-light mb-4">
        <h2>Edycja konta użytkownika</h2>
        
        <div *ngIf="message" [class]="'alert ' + messageType">{{ message }}</div>

        <!-- Form -->
        <form [formGroup]="profileForm" (ngSubmit)="onProfileUpdate()">
          <div class="mb-3">
            <label>Imię</label>
            <input type="text" class="form-control" formControlName="firstName">
          </div>
          <div class="mb-3">
            <label>Nazwisko</label>
            <input type="text" class="form-control" formControlName="lastName">
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input type="email" class="form-control" formControlName="email">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid">Zapisz zmiany</button>
        </form>
      </div>

      <hr class="my-4">

      <div class="card p-4 bg-light mb-4">
        <h3>Zmiana hasła</h3>
        <form [formGroup]="passwordForm" (ngSubmit)="onPasswordChange()">
          <div class="mb-3">
            <label>Aktualne hasło</label>
            <input type="password" class="form-control" formControlName="currentPassword">
          </div>
          <div class="mb-3">
            <label>Nowe hasło</label>
            <input type="password" class="form-control" formControlName="newPassword">
          </div>
          <div class="mb-3">
            <label>Potwierdź nowe hasło</label>
            <input type="password" class="form-control" formControlName="confirmNewPassword">
            <div *ngIf="passwordForm.errors?.['passwordMismatch'] && (passwordForm.touched || passwordForm.dirty)" class="text-danger small">
              Hasła muszą być identyczne.
            </div>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="passwordForm.invalid">Zmień hasło</button>
        </form>
      </div>

      <hr class="my-4">

      <button class="btn btn-danger w-100" (click)="showDeleteModal = true">Usuń konto</button>

      <app-custom-modal [isOpen]="showDeleteModal" (onClose)="showDeleteModal = false">
        <p>Czy na pewno chcesz usunąć swoje konto?<br>To działanie jest nieodwracalne!</p>
        <div class="d-flex justify-content-center gap-2 mt-3">
          <button (click)="handleDeleteAccount()" class="btn btn-danger">Usuń</button>
          <button (click)="showDeleteModal = false" class="btn btn-secondary">Anuluj</button>
        </div>
      </app-custom-modal>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  message = '';
  messageType = '';
  showDeleteModal = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', Validators.email]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {

  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmNewPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onProfileUpdate() {
    if (this.profileForm.valid) {
      const data = Object.fromEntries(Object.entries(this.profileForm.value).filter(([_, v]) => v !== ''));
      
      this.apiService.updateUser(data).subscribe({
        next: () => this.showMessage('Profil zaktualizowany', 'alert-success'),
        error: (err) => this.showMessage(err.error.message || 'Błąd', 'alert-danger')
      });
    }
  }

  onPasswordChange() {
    if (this.passwordForm.valid) {
      this.apiService.updateUser(this.passwordForm.value).subscribe({
        next: () => {
          this.showMessage('Hasło zmienione', 'alert-success');
          this.passwordForm.reset();
        },
        error: (err) => this.showMessage(err.error.message || 'Błąd', 'alert-danger')
      });
    }
  }

  handleDeleteAccount() {
    this.apiService.deleteUser().subscribe({
      next: () => {
        localStorage.removeItem('token');
        window.location.href = '/';
      },
      error: (err) => this.showMessage(err.error.message || 'Błąd', 'alert-danger')
    });
  }

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }
}