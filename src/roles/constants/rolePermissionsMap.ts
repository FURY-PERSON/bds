import { Roles } from "src/roles/types";

export const rolePermissionsMap: Record<Roles, Array<string>> = {
  admin: ['admin', 'student', 'user', 'worker'],
  worker: ['worker', 'user'],
  student: ['user', 'student'],
  user: ['user']
}