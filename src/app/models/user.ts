export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  authorities?: string[];
  permissions?: Permissions[];
}

export interface Permissions {
  permissionName : string;
  description : string;
  active : boolean;
}
