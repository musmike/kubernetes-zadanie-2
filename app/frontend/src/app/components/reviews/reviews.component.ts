import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomModalComponent } from '../shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CustomModalComponent],
  template: `
    <div>
      <header class="masthead" style="background-image: url('https://www.sheknows.com/wp-content/uploads/2022/09/right-time-to-express-opinions.jpg?w=1440')">
        <div class="container position-relative px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
              <div class="site-heading text-center text-white pt-5" style="text-shadow: 1px 1px 2px black;">
                <h1>Opinie o naszym sklepie</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="container my-4">
        <!-- Add Review -->
        <div *ngIf="user" class="mb-5">
          <textarea class="form-control mb-2" style="height: 150px;" placeholder="Dodaj opinię" [(ngModel)]="newReview"></textarea>
          <button type="button" (click)="handleAddReview()" class="btn btn-secondary">Dodaj opinię</button>
          <div *ngIf="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
          <hr class="my-4" />
        </div>

        <!-- List Reviews -->
        <div class="opinions-list">
          <div *ngFor="let review of reviews" class="py-3">
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold">{{ getAuthorName(review.author) }}</span>
              <span class="text-muted">{{ review.updated_at | date:'dd.MM.yyyy, HH:mm' }}</span>
            </div>

            <div class="mt-2">
              <div *ngIf="editingReview?._id === review._id; else viewMode">
                <textarea class="form-control" [(ngModel)]="editingReview.content"></textarea>
                <div *ngIf="editErrorMessage" class="alert alert-danger mt-2">{{ editErrorMessage }}</div>
                <button type="button" (click)="handleSaveEdit()" class="btn btn-success btn-sm mt-2">Zapisz</button>
              </div>
              <ng-template #viewMode>
                <p>{{ review.content }}</p>
              </ng-template>
            </div>

            <div *ngIf="canEdit(review)" class="d-flex justify-content-end gap-2 mt-2">
              <button type="button" class="btn btn-success btn-sm" (click)="handleEdit(review)">Edytuj</button>
              <button type="button" class="btn btn-danger btn-sm" (click)="confirmDelete(review._id)">Usuń</button>
            </div>
            <hr class="my-4" />
          </div>
        </div>
      </div>

      <!-- Modal -->
      <app-custom-modal [isOpen]="!!reviewToDelete" (onClose)="reviewToDelete = null">
        <p>Czy na pewno chcesz usunąć tę opinię?</p>
        <div class="d-flex justify-content-center gap-2 mt-3">
          <button type="button" (click)="handleDelete()" class="btn btn-danger">Usuń</button>
          <button type="button" (click)="reviewToDelete = null" class="btn btn-secondary">Anuluj</button>
        </div>
      </app-custom-modal>
    </div>
  `
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  user: any = null;
  newReview = '';
  editingReview: any = null;
  reviewToDelete: string | null = null;
  
  errorMessage = '';
  editErrorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.user = this.apiService.getUser();
    this.fetchReviews();
  }

  fetchReviews() {
    this.apiService.getReviews().subscribe({
      next: (data) => this.reviews = data,
      error: () => this.errorMessage = 'Błąd pobierania opinii'
    });
  }

  getAuthorName(author: any): string {
    return author ? `${author.firstName} ${author.lastName}` : '[Konto usunięte]';
  }

  canEdit(review: any): boolean {
    if (!this.user) return false;
    return this.user.status === 'admin' || (review.author && review.author._id === this.user._id);
  }

  handleAddReview() {
    if (!this.newReview.trim()) return;
    this.apiService.createReview(this.newReview).subscribe({
      next: () => {
        this.newReview = '';
        this.fetchReviews();
      },
      error: (err) => this.errorMessage = err.error.message || 'Błąd'
    });
  }

  handleEdit(review: any) {
    this.editingReview = { ...review };
    this.editErrorMessage = '';
  }

  handleSaveEdit() {
    if (!this.editingReview.content.trim()) {
      this.editErrorMessage = 'Treść nie może być pusta';
      return;
    }
    this.apiService.updateReview(this.editingReview._id, this.editingReview.content).subscribe({
      next: () => {
        this.editingReview = null;
        this.fetchReviews();
      },
      error: (err) => this.editErrorMessage = err.error.message || 'Błąd'
    });
  }

  confirmDelete(id: string) {
    this.reviewToDelete = id;
  }

  handleDelete() {
    if (this.reviewToDelete) {
      this.apiService.deleteReview(this.reviewToDelete).subscribe({
        next: () => {
          this.reviewToDelete = null;
          this.fetchReviews();
        },
        error: (err) => console.error(err)
      });
    }
  }
}