import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/authService/auth';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css'
})
export class ForbiddenComponent {
  errorMessage = '';

  constructor(private router: Router, private authService: Auth) {
    this.errorMessage = history.state?.message || '';
  }

  goBack() {
    const route = this.authService.getRoleBasedRoute();
    this.router.navigate([route]);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}

