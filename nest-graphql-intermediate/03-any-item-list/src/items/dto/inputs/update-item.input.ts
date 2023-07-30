import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';

@InputType()
// ojo que partial type deja todas las propiedades como opcionales a pesar de declararlas obligatorias.En resumen ya tengo todo
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

}
