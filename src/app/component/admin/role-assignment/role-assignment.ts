import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../services/roleService/role-service';
import { UserService } from '../../../services/userService/user-service';
import { RoleResponse } from '../../../models/roleResponse';
import { User } from '../../../models';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-role-assignment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-assignment.html',
  styleUrl: './role-assignment.css'
})
export class RoleAssignment implements OnInit {
  @Input() user: User | null = null;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() roleAssigned = new EventEmitter<void>();

  roles = signal<RoleResponse[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(
    private roleService: RoleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().pipe(
      catchError(error => {
        console.error('Error loading roles:', error);
        return EMPTY;
      })
    ).subscribe(roles => {
      this.roles.set(roles);
    });
  }

  assignRole(roleId: number): void {
    if (!this.user) return;

    this.loading.set(true);
    this.error.set('');

    this.userService.assignRole(this.user.id, roleId).pipe(
      finalize(() => this.loading.set(false)),
      catchError(error => {
        this.error.set('Erreur lors de l\'assignation du rôle');
        return EMPTY;
      })
    ).subscribe(() => {
      this.roleAssigned.emit();
      this.onClose();
    });
  }

  onClose(): void {
    this.close.emit();
  }
}