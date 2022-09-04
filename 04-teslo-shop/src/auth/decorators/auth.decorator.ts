import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role.guard";
import { ValidRoles } from "../interfaces/valid-roles";
import { RoleProtected } from "./role-protected.decorator";

// El decorador seŕa @Auth y lleva un arg,ojo
export function Auth(...roles:ValidRoles[]){
  // en este punto tengo que declarar mis decoradores a juntar sin la '@'
  return applyDecorators(
    RoleProtected(...roles), // esparcir el arreglo,ojo,no pedia un array
    UseGuards(AuthGuard(),UserRoleGuard)

  )
}