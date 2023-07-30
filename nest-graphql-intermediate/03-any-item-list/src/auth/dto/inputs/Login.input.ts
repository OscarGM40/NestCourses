import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Email del usuario' })
  @IsEmail()
  email: string;


  @Field(() => String, { description: 'Password del usuario' })
  @Length(6, 50)
  password: string;
}
