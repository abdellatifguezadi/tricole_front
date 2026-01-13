import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/authService/auth';
import { Router } from '@angular/router';
import { catchError, finalize, tap, of } from 'rxjs';
import { InputField } from '../input-field/input-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  private authService = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  rememberMe = signal(false);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      const roleRoute = this.authService.getRoleBasedRoute();
      this.router.navigate([roleRoute]);
    }
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.getRawValue()).pipe(

      tap(() => {
        const roleRoute = this.authService.getRoleBasedRoute();
        this.router.navigate([roleRoute]);
      }),

      catchError(err => {
        console.error(err);
        let message = err.error.error;

        this.errorMessage.set(message);
        return of(null);
      }),

      finalize(() => {
        this.isLoading.set(false);
      })

    ).subscribe();
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
