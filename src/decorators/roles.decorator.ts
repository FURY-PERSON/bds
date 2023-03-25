import { SetMetadata } from "@nestjs/common";
import { Role } from "src/roles/roles.entity";

export const ROLES_KEY = 'roles'

export function Roles(role: Role) {
  return SetMetadata(ROLES_KEY, role)
}