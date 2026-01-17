import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="masthead" style="background-image: url('https://images.pexels.com/photos/1630039/pexels-photo-1630039.jpeg')">
        <div class="container position-relative px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-md-10 col-lg-8 col-xl-7">
                    <div class="site-heading text-center text-white pt-5">
                        <h1>Wędkarstwo naszą pasją</h1>
                        <span class="subheading">Strona dla początkujących i zaawansowanych wędkarzy</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="container px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7" *ngFor="let post of posts">
                <div class="post-preview">
                    <div class="d-flex justify-content-center">
                        <img class="img-fluid" [src]="post.image_link" alt="Opis zdjęcia" />
                    </div>
                    <a [routerLink]="['/post', post._id]" class="text-decoration-none text-dark">
                        <h2 class="post-title mt-3">{{ post.title }}</h2>
                        <h3 class="post-subtitle fw-light">{{ post.short_description }}</h3>
                    </a>
                    <p class="post-meta text-muted fst-italic">
                        Opublikowano przez <b>{{ post.author }}</b> dnia {{ post.created_at | date:'dd.MM.yyyy' }}
                    </p>
                </div>
                <hr class="my-4" />
            </div>
        </div>

        <div class="row justify-content-end mb-4" *ngIf="hasMore">
            <div class="col-md-6 text-end">
                <button class="btn btn-primary text-uppercase" (click)="loadMore()">Więcej →</button>
            </div>
        </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  page = 1;
  hasMore = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.apiService.getPosts(this.page).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.hasMore = false;
        } else {
          this.posts = [...this.posts, ...data];
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadMore() {
    this.page++;
    this.fetchPosts();
  }
}
