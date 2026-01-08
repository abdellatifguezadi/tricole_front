import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidebar-items',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-items.html',
  styleUrl: './sidebar-items.css',
})
export class SidebarItems {
  @Input() title: string = '';

}
