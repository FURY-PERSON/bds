import { SetMetadata } from "@nestjs/common";
import { Roles as RolesEnum } from "src/roles/types";

export const ROLES_KEY = 'roles'

type RolesEnumValues =`${RolesEnum}`;

export function Roles(...roles: Array<RolesEnumValues>) {
  return SetMetadata(ROLES_KEY, roles)
}