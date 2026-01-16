import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Auth
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  // Posts
  getPosts(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/posts?page=${page}`);
  }

  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/post/${id}`);
  }

  // Reviews
  getReviews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/reviews`);
  }

  createReview(content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/review`, { content });
  }

  updateReview(id: string, content: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/review/${id}`, { content });
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/review/${id}`);
  }

  // User
  updateUser(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/user`, data);
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/user`);
  }
}