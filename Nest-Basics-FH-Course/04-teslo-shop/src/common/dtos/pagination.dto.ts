import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @ApiProperty({default:10,description:'How many rows do you need',required:false})
  @IsInt() @IsPositive() @IsOptional() @Type( () => Number)
  limit?: number;

 @ApiProperty({default:0,description:'How many rows do want to skip',required:false}) 
  @Min(0) @IsOptional() @Type( () => Number)
  offset?: number;

}