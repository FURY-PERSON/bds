import { Roles } from "src/roles/types";
import { QueryParam } from "src/types/queryParam";

export interface GetAllUsersParam extends QueryParam {
  login?: string;
  orderBy?: "DESC" | "ASC";
  role: Roles,
  sort: "login" | "firstName" | "lastName"
}