import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/authService/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  credentials = {
    username: '',
    password: ''
  };

  showPassword = false;
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.credentials.username && this.credentials.password) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login({
        username: this.credentials.username,
        password: this.credentials.password
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful:', response);
          this.router.navigate(['/admin_dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
          console.error('Login error:', error);
        }
      });
    }
  }
}