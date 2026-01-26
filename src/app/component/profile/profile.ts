import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/authService/auth';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private authService = inject(Auth);
  
  user = this.authService.currentUser;
}