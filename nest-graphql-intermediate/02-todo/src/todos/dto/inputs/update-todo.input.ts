import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

@InputType()
export class UpdateTodoInput {
  @Field(() => Int, {
    description: 'id del todo a actualizar',
    nullable: false,
  })
  @IsInt()
  @Min(1)
  id: number;

  @Field(() => String, {
    description: 'actualizar description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  @Transform(({ value }) => value.trim())
  description?: string;

  @Field(() => Boolean, {
    description: 'tarea terminada Si/no',
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
