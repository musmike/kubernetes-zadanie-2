import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PostComponent } from './components/post/post.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  { 
    path: 'home', 
    component: HomeComponent, 
    title: 'Wędkarstwo naszą pasją' 
  },
  
  { 
    path: 'login', 
    component: LoginComponent, 
    title: 'Logowanie',
    canActivate: [guestGuard] 
  },
  { 
    path: 'register', 
    component: RegisterComponent, 
    title: 'Rejestracja',
    canActivate: [guestGuard]
  },

  { path: 'post/:postId', component: PostComponent, title: 'Post' },
  { path: 'reviews', component: ReviewsComponent, title: 'Opinie' },
  { path: 'about', component: AboutComponent, title: 'O nas' },
  { path: 'contact', component: ContactComponent, title: 'Kontakt' },

  { 
    path: 'profile', 
    component: ProfileComponent, 
    title: 'Profil',
    canActivate: [authGuard] 
  },

  { path: '**', redirectTo: '/home' }
];