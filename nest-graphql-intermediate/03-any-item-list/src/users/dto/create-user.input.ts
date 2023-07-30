import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateUserInput {

  @Field(() => String, { description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'FullName del usuario' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => String, { description: 'Password del usuario' })
  // con @MinLength(6) y sin max tmb valdría
  @Length(6, 50)
  password: string;
}
