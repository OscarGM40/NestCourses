import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'descripcion de la tarea a realizar' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Transform(({ value }) => value.trim())
  description: string;
}
