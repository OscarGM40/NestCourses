import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  // que sea un string(con lo que no me pueden mandar numeros o objetos,interesante) y que no sea un string vacio
  @IsString()
  @IsNotEmpty({ message: 'el campo description es requerido' })
  description: string;
}
