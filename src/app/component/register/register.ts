import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../../services/authService/auth';
import {Router} from '@angular/router';
import { InputField } from '../input-field/input-field';

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

  submit(){
    if (this.registerForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        let message = err.error.error;

        this.errorMessage.set(message);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
