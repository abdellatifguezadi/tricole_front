import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../../services/authService/auth';
import {Router} from '@angular/router';
import { InputField } from '../shared/input-field/input-field';
import {catchError, tap} from 'rxjs/operators';
import {finalize, of} from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InputField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);


  isLoading = signal(false);
  errorMessage = signal('');

  registerForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required , Validators.email],
    password: ['', Validators.required],
    fullName: ['', Validators.required],
  });

  submit() {
    if (this.registerForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerForm.getRawValue()).pipe(

      tap(() => {
        this.router.navigate(['/login']);
      }),

      catchError(err => {
        console.error(err);
        const message = err?.error?.error ?? 'Erreur inattendue';
        this.errorMessage.set(message);
        return of(null);
      }),

      finalize(() => {
        this.isLoading.set(false);
      })

    ).subscribe();
  }


  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
