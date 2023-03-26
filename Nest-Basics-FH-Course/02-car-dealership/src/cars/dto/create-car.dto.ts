import { IsString, MinLength } from "class-validator";

export class CreateCarDto {

  @IsString({message:'La prop brand debe ser un string'})
  readonly brand: string;

  @IsString()
  @MinLength(3,{message:'El modelo debe de tener minimo 3 caracteres'})
  readonly model: string;

}
