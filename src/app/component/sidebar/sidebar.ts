import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {Auth} from '../../services/authService/auth';
import {SidebarItems} from '../sidebar-items/sidebar-items';

@Component({
  selector: 'app-sidebar',
  imports: [
    SidebarItems
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {



  private router = inject(Router);
  private authService = inject(Auth);

  protected user = this.authService.getCurrentUser();

  logout() {
    console.log(this.user);
    this.authService.logout();
    this.router.navigate(['/login']);
  }




}
