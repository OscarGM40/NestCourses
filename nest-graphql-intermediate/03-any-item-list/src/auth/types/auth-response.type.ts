import { User } from './../../users/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  token: string;

  // recuerda que User es una entidad(va para la property de TS) y un ObjectType(va para el field)
  @Field(() => User)
  user: User;
}
