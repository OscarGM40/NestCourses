import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRolesArgs } from 'src/auth/dto/args/roles.arg';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // recuerda que la diferencia entre los @Args(name:string) y los @Input() es que los INputs vienen como si fuera una petición POST O PUT, es decir,como si fuera el body.Los @Args son más como si fueran query parameters, más como si fuera una petición GET. Desde luego es una explicación un tanto difusa
  @Query(() => [User], { name: 'getAllUsers' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'getOneUserById' })
  findOne(
    // fijate que el parser del UUID es interesante para que ni llegue al servicio si mandan cualquier mierda
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  // se recomienda darle siempre el name y que no coga el del resolver
  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id,user);
  }

  // se recomienda darle siempre el name y que no coga el del resolver
  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') userInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.update(userInput.id,userInput,user);
  }
}
