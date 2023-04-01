import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  // fijate que al extender de PartialType<T> ahora todas las propiedades de T son opcionales luego description es opcional en este Dto pero requerida en el createDto.Interesante
  @IsOptional()
  @IsBoolean()
  done: boolean;
}
