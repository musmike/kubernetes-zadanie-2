import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <main class="mb-4 mt-5" *ngIf="post; else loading">
      <div class="container px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 justify-content-center">
          <div class="col-md-10 col-lg-8 col-xl-7 text-center">
            <h2 class="section-heading">{{ post.title }}</h2>
            <p class="text-muted fst-italic">
              Opublikowano przez <b>{{ post.author }}</b> dnia {{ post.created_at | date:'dd.MM.yyyy' }}
            </p>
            <img class="img-fluid mb-4" [src]="post.image_link" alt="Opis zdjęcia" />
            <p>{{ post.content }}</p>
          </div>
        </div>
      </div>
    </main>
    <ng-template #loading><div class="text-center mt-5">Loading...</div></ng-template>
  `,
  styles: ['.section-heading { font-size: 2.25rem; font-weight: 700; margin-top: 3.75rem; }']
})
export class PostComponent implements OnInit {
  post: any = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.apiService.getPostById(postId).subscribe({
        next: (data) => this.post = data,
        error: (err) => console.error(err)
      });
    }
  }
}