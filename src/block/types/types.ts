import { QueryParam } from "src/types/queryParam";

export interface GetAllBlocksParam extends QueryParam {
  number?: string;
  orderBy?: "DESC" | "ASC";
  floor?: number,
}