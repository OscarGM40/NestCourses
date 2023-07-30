import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[], context: ExecutionContext) => {
    // normalmente tendré que pasar el contexto de Nest a GraphQL si uso GraphQL
    const ctx = GqlExecutionContext.create(context);
    // del context quiero la request(ctx.getContext().req) y despues el user
    const user: User = ctx.getContext().req.user;
    if (!user) {
      // siempre debe haber un user en la request,es fallo de back si entramos aqui
      throw new InternalServerErrorException(`No user inside the request`);
    }
 
    if (roles.length === 0) return user;
    for (const role of user.roles) {
      // TODO eliminar casteo
      if (roles.includes(role as ValidRoles)) {
        return user;
      }
    }
    // si llegamos aqui no tiene el rol necesario
    throw new ForbiddenException(
      `User ${user.fullName} need a valid role[${roles}]`,
    );
  },
);
