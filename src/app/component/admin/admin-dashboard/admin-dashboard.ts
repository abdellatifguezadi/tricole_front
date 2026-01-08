import { Component } from '@angular/core';
import {Sidebar} from '../../sidebar/sidebar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    Sidebar
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

}
