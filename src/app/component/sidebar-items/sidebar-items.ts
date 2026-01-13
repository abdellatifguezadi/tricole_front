import {Component, Input} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-sidebar-items',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar-items.html',
  styleUrl: './sidebar-items.css',
})
export class SidebarItems {
  @Input() title: string = '';
  @Input() routerLink: string = '';
}
