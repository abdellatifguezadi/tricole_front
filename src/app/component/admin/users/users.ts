import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {User, Permissions} from '../../../models';
import {UserService} from '../../../services/userService/user-service';
import {catchError} from 'rxjs/operators';
import {EMPTY, finalize} from 'rxjs';
import {ErrorMessage} from '../../error-message/error-message';
import {MobileCard} from '../../shared/mobile-card/mobile-card';
import {Sidebar} from '../../sidebar/sidebar';
import {Table, TableAction, TableColumn} from '../../shared/table/table';
import {RoleAssignment} from '../role-assignment/role-assignment';
import {FormGroup} from '@angular/forms';
import {Auth} from '../../../services/authService/auth';
import {RoleResponse} from '../../../models/roleResponse';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    ErrorMessage,
    MobileCard,
    Sidebar,
    Table,
    RoleAssignment
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
  standalone: true
})
export class Users implements OnInit {
  users: WritableSignal<User[]> = signal<User[]>([]);
  loading = signal(false);
  error = signal('');
  sidebarOpen = signal(false);
  showPermissionsModal = signal(false);
  selectedUser = signal<User | null>(null);
  selectedPermissions = signal<Permissions[]>([]);
  permissionLoading = signal(false);
  permissionError = signal('');
  showRoleModal = signal(false);


  columns: TableColumn[] = [
    {key: 'id', label: 'ID', type: 'number'},
    {key: 'username', label: 'Username', type: 'text'},
    {key: 'email', label: 'Email', type: 'text'},
    {key: 'fullName', label: 'Full name', type: 'text'},
    {key: 'role.name', label: 'Role', type: 'text'}
  ]

  cardFields = [
    {key: 'id', label: 'ID'},
    {key: 'username', label: 'Username'},
    {key: 'email', label: 'Email'},
    {key: 'fullName', label: 'Full name'},
    {key: 'role.name', label: 'Role'}
  ];

  actions: TableAction[] = [
    {
      label: 'Add Role',
      action: 'addRole',
      class: 'text-blue-600 hover:text-blue-900 mr-3',
      showIf: (item: any) => !item?.role
    },
    {
      label: 'Permissions',
      action: 'permissions',
      class: 'text-green-600 hover:text-green-900',
      showIf: (item: any) => item?.role && item?.permissions && item?.permissions.length > 0
    }
  ]


  constructor(private userService: UserService) {
  }
  authService : Auth =  inject(Auth)

  ngOnInit(): void {
    this.loadUsers();
  }


  loadUsers(): void {
    this.loading.set(true);
    this.error.set('');

    this.userService.getUsers().pipe(
      finalize(() =>
        this.loading.set(false)
      ),
      catchError(
        error => {
          this.error.set('Erreur lors du chargement des utilisateurs')
          return EMPTY;
        })
    ).subscribe(data => {
      this.users.set(data);
    })
  }

  getRoleName(user: User): string {
    if (!user.role) return 'Aucun rôle';
    return typeof user.role === 'string' ? user.role : user.role;
  }

  getSelectedUserRoleName(): string {
    const user = this.selectedUser();
    return user ? this.getRoleName(user) : 'Aucun rôle';
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  onTableAction = (action: string, item: any) => {
    if (action === 'permissions') {
      this.openPermissions(item);
    } else if (action === 'addRole') {
      this.openRoleModal(item);
    }
  }

  openPermissions(user: User) {
    if (!user || !user.permissions) return;
    this.selectedUser.set(user);
    this.selectedPermissions.set(user.permissions);
    this.showPermissionsModal.set(true);
    this.permissionError.set('');
  }

  closePermissions() {
    this.showPermissionsModal.set(false);
    this.selectedUser.set(null);
    this.selectedPermissions.set([]);
    this.permissionError.set('');
  }

  togglePermission(permission: Permissions) {
    const user = this.selectedUser();
    if (!user) return;

    const action = permission.active ? 'désactiver' : 'activer';
    const confirmMessage = `Êtes-vous sûr de vouloir ${action} la permission "${permission.permissionName}" pour l'utilisateur "${user.fullName}" ?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.permissionLoading.set(true);
    this.permissionError.set('');

    const operation = permission.active
      ? this.userService.deactivePermission(user.id, permission.id)
      : this.userService.activePermission(user.id, permission.id);

    operation.pipe(
      finalize(() => this.permissionLoading.set(false)),
      catchError(error => {
        console.error('Permission toggle error:', error);
        this.permissionError.set(
          `Erreur lors de la ${permission.active ? 'désactivation' : 'activation'} de la permission: ${error.error?.message || 'Erreur inconnue'}`
        );
        return EMPTY;
      })
    ).subscribe(() => {
      const updatedPermissions = this.selectedPermissions().map(p =>
        p.id === permission.id ? { ...p, active: !p.active } : p
      );
      this.selectedPermissions.set(updatedPermissions);

      const updatedUsers = this.users().map(u =>
        u.id === user.id ? { ...u, permissions: updatedPermissions } : u
      );
      this.users.set(updatedUsers);

    });
  }

  openRoleModal(user: User): void {
    this.selectedUser.set(user);
    this.showRoleModal.set(true);
  }

  closeRoleModal(): void {
    this.showRoleModal.set(false);
    this.selectedUser.set(null);
  }

  onRoleAssigned(): void {
    this.loadUsers();
    this.closeRoleModal();
  }

}
