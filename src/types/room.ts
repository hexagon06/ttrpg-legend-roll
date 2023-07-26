export type Room = {
  name: string;
  roles: UserRoles;
};
export type UserRoles = { [key: string]: string };
