
import { registerEnumType } from "@nestjs/graphql";

//  TIP las enums de GraphQL son iguales que las de Typescript
export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

// NOTA para implementar la enum como un GraphQl Type tenemos que usar el método registerEnumType(enum,{name:''}).Fijate que este paso ha sido crucial
registerEnumType(ValidRoles,{name:'ValidRoles'})