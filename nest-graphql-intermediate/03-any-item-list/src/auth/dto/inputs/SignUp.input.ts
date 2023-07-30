import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// recuerda que es este decorador el que hace que exista este tipo T en GraphQL
@InputType()
export class SignupInput {
  
  @Field(() => String, { description: 'Email del usuario' })
  @IsEmail()
  email:string;
  
  @Field(() => String, { description: 'FullName del usuario' })
  @IsString()
  @IsNotEmpty()
  fullName:string;
  
  @Field(() => String, { description: 'Password del usuario' })
  // me gusta más @Length pero @MinLength(6) y sin max tmb es buena idea
  @Length(6,50)
  password:string;
}
