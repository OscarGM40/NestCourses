import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1, { message: 'number must be minimum 1' })
  no: number;

  @IsString()
  @MinLength(1, { message: 'string must have at least 1 ch' })
  name: string;
}
