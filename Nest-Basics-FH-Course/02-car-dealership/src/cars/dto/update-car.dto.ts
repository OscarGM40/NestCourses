import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateCarDto {
  // es muy probable que reciba el ID desde el front
  @IsString()
  @IsUUID()
  @IsOptional()
  readonly id?: string;
  
  @IsString()
  @IsOptional()
  readonly brand ?: string;
  
  @IsString()
  @IsOptional()
  readonly model ?: string;

}